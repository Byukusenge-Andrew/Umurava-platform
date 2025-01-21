/**
 * @module ErrorHandler
 * @description Custom error classes and error handling utilities
 */

/**
 * @class AppError
 * @description Base error class for application errors
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @constructor
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {boolean} isOperational - Whether error is operational
   */
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * @class ValidationError
 * @description Error for validation failures
 * @extends AppError
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`);
  }
}
