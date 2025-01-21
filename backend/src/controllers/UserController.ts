/**
 * @module UserController
 * @description Handles user-related HTTP requests
 */

import { Request, Response } from 'express';
import { Model, Types } from 'mongoose';
import BaseController from './BaseController';
import bcrypt from 'bcryptjs';
import { AdminRequestStatus } from '../types';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/User';
import { IUser, File } from '../types';
import logger from '../utils/logger';
import { upload } from '@/utils/gridfs';
import { AuthenticationError, AuthorizationError } from '../utils/errorHandler';
import { ValidationError } from '../utils/errorHandler';

declare module 'express' {
    interface Request {
        user?: IUser;
    }
}

interface IUserModel extends Model<IUser> {
    comparedPassword(password: string): Promise<boolean>;
}

export default class UserController extends BaseController<IUser> {
    /**
     * @constructor
     * @description Initialize UserController with User model
     */
    constructor() {
        super(User as unknown as Model<IUser>);
    }

    /**
     * @method login
     * @description Authenticate user and generate JWT token
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @returns {Promise<void>}
     */
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email }).select('+password') as IUser;
            
            if (!user || !(await user.comparedPassword(password))) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            res.status(200).json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            logger.error('Error in login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    /**
     * @method uploadProfilePicture
     * @description Upload and update user's profile picture
     * @param {Request} req - Express request object with file
     * @param {Response} res - Express response object
     * @throws {AuthenticationError} If user not found
     * @returns {Promise<void>}
     */
    uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.user?._id);
            if (!user) {
                throw new AuthenticationError('User not found');
            }

            if (!req.file) {
                throw new ValidationError('No file uploaded');
            }

            user.picture = {
                fileId: new Types.ObjectId(req.file.filename),
                metadata: {
                    filename: req.file.originalname,
                    contentType: req.file.mimetype,
                    length: req.file.size,
                    uploadDate: new Date()
                }
            };

            await user.save();
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            logger.error('Error uploading profile picture:', error);
            throw error;
        }
    };

    getUserStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await User.findById(req.user?._id)
                .populate('completedChallenges')
                .populate('ongoingChallenges')
                .populate('createdChallenges');

            if (!user) {
                throw new AuthenticationError('User not found');
            }

            res.status(200).json({
                success: true,
                data: {
                    completedChallenges: {
                        count: user.getChallengeCount('completed'),
                        challenges: user.completedChallenges
                    },
                    ongoingChallenges: {
                        count: user.getChallengeCount('ongoing'),
                        challenges: user.ongoingChallenges
                    },
                    createdChallenges: {
                        count: user.getChallengeCount('created'),
                        challenges: user.createdChallenges
                    }
                }
            });
        } catch (error) {
            logger.error('Error getting user stats:', error);
            throw error;
        }
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };
            const currentUser = req.user as IUser; // Assuming user is set by auth middleware

            // Check if user exists
            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Only admin can change roles
            if (updateData.role && !currentUser.isAdmin()) {
                delete updateData.role;
            }

            // Handle password update
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }

            // Validate user-specific fields
            if (user.role === 'user') {
                // User can only update specific fields
                const allowedFields = ['name', 'email', 'password', 'number'];
                Object.keys(updateData).forEach(key => {
                    if (!allowedFields.includes(key)) {
                        delete updateData[key];
                    }
                });
            }

            // Validate admin-specific fields
            if (user.role === 'admin' && !currentUser.isAdmin()) {
                const adminFields = ['isSuper', 'managedUsers'];
                adminFields.forEach(field => {
                    if (field in updateData) {
                        delete updateData[field];
                    }
                });
            }

            // Update challenge-related fields with new names
            if (updateData.completedchallenge !== undefined) {
                user.completedChallenges = updateData.completedChallenges;
            }
            if (updateData.OngoingChallenge !== undefined) {
                user.ongoingChallenges = updateData.ongoingChallenges;
            }
            if (updateData.challengecreated !== undefined) {
                user.createdChallenges = updateData.createdChallenges;
            }

            // Update user
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { $set: updateData },
                { 
                    new: true, 
                    runValidators: true,
                    context: 'query'
                }
            ).select('-password');

            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Log the update
            logger.info(`User ${id} updated by ${currentUser._id}`);
            
            res.status(200).json({
                message: 'User updated successfully',
                user: updatedUser
            });

        } catch (error: unknown) {
            logger.error('Error in updateUser:', error);
            if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
                const validationError = error as unknown as { errors: { message: string }[] };
                res.status(400).json({ 
                    message: 'Invalid data provided',
                    errors: Object.values(validationError.errors).map(err => err.message)
                });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    // Add method to update user stats
    updateUserStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { completedchallenge, OngoingChallenge, challengecreated } = req.body;

            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            if (user.role === 'user') {
                if (completedchallenge !== undefined) {
                    user.completedChallenges = completedchallenge;
                }
                if (OngoingChallenge !== undefined) {
                    user.ongoingChallenges = OngoingChallenge;
                }
            }

            if (user.role === 'admin' && challengecreated !== undefined) {
                user.challengecreated = challengecreated;
            }

            await user.save();
            res.status(200).json({
                message: 'User stats updated successfully',
                user
            });

        } catch (error) {
            logger.error('Error in updateUserStats:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    requestAdminRole = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?._id;
            const user = await User.findById(userId);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            await user.requestAdminRole();
            res.status(200).json({
                message: 'Admin role request submitted successfully',
                status: user.adminRequest?.status
            });
        } catch (error) {
            logger.error('Error in requestAdminRole:', error);
            res.status(400).json({ message: error instanceof Error ? error.message : 'Error processing request' });
        }
    };

    processAdminRequest = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const { status, reason } = req.body;
            const superUser = req.user as IUser;

            if (!superUser || !superUser.isSuper()) {
                res.status(403).json({ message: 'Only super users can process admin requests' });
                return;
            }

            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            if (user.adminRequest?.status !== AdminRequestStatus.PENDING) {
                res.status(400).json({ message: 'No pending admin request found' });
                return;
            }

            user.adminRequest = {
                ...user.adminRequest,
                status,
                processedBy: superUser._id as Types.ObjectId,
                processedDate: new Date(),
                reason
            };

            if (status === AdminRequestStatus.APPROVED) {
                user.role = 'admin';
            }

            await user.save();
            res.status(200).json({
                message: `Admin request ${status}`,
                user
            });
        } catch (error) {
            logger.error('Error in processAdminRequest:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getPendingAdminRequests = async (req: Request, res: Response): Promise<void> => {
        try {
            const superUser = req.user as IUser;
            if (!superUser || !superUser.isSuper()) {
                res.status(403).json({ message: 'Only super users can view pending requests' });
                return;
            }

            const pendingRequests = await User.find({
                'adminRequest.status': AdminRequestStatus.PENDING
            }).select('-password');

            res.status(200).json(pendingRequests);
        } catch (error) {
            logger.error('Error in getPendingAdminRequests:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    searchUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { query } = req.query; // Get search query from request
            if (typeof query !== 'string') {
                throw new Error('Invalid query type');
            }
            const users = await User.find({ $text: { $search: query } }).select('-password');
            res.status(200).json(users);
        } catch (error) {
            logger.error('Error in searchUsers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}
