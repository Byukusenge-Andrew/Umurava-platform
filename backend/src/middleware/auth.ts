/**
 * @module Auth
 * @description Authentication and authorization middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../types';
import User from '../models/User';
import logger from '../utils/logger';
import { AuthenticationError, AuthorizationError } from '../utils/errorHandler';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

/**
 * @middleware protect
 * @description Verify JWT token and attach user to request
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @throws {AuthenticationError} If token is invalid or missing
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AuthenticationError('Not authorized to access this route');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new AuthenticationError('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Auth error:', error);
        next(error);
    }
};

/**
 * @middleware authorize
 * @description Check if user has required role
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 * @throws {AuthorizationError} If user role is not allowed
 */
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AuthorizationError(`Role ${req.user?.role} is not authorized to access this route`);
        }
        next();
    };
};

/**
 * @middleware isSuperAdmin
 * @description Check if user is super admin
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @throws {AuthorizationError} If user is not super admin
 */
export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.isSuper()) {
        throw new AuthorizationError('Only super admins can access this route');
    }
    next();
};
