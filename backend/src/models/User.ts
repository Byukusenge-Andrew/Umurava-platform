/**
 * @module User
 * @description User model and schema definition
 */

import { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, AdminRequestStatus } from "../types";
import logger from "../utils/logger";

/**
 * @interface IUserDocument
 * @extends Document
 * @description Interface for User document with additional Mongoose methods
 */
interface IUserDocument extends Document {
    isModified(path: string): boolean;
    password: string;
}

/**
 * @const UserSchema
 * @description Mongoose schema definition for User
 */
const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    number: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'super_admin'],
        default: 'user'
    },
    profilePicture: String,
    
    // User-only attributes
    completedChallenges: [{
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
        default: []
    }],
    ongoingChallenges: [{
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
        default: []
    }],

    // Admin-only attributes
    createdChallenges: [{
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
        default: []
    }],
    adminRequest: {
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        requestDate: {
            type: Date,
            default: Date.now
        },
        processedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        processedDate: Date,
        reason: String
    }
}, {
    timestamps: true,
});

/**
 * @method isAdmin
 * @description Checks if user has admin role
 * @returns {boolean} True if user is admin
 */
UserSchema.methods.isAdmin = function(): boolean {
    return this.role === 'admin';
};

/**
 * @method isUser
 * @description Checks if user has regular user role
 * @returns {boolean} True if user is regular user
 */
UserSchema.methods.isUser = function(): boolean {
    return this.role === 'user';
};

/**
 * @method isSuper
 * @description Checks if user has super admin role
 * @returns {boolean} True if user is super admin
 */
UserSchema.methods.isSuper = function(): boolean {
    return this.role === 'super_admin';
};

/**
 * @method requestAdminRole
 * @description Request admin role for current user
 * @throws {Error} If user is already admin or has pending request
 * @returns {Promise<void>}
 */
UserSchema.methods.requestAdminRole = async function(): Promise<void> {
    if (this.role === 'admin') {
        throw new Error('User is already an admin');
    }
    if (this.adminRequest?.status === AdminRequestStatus.PENDING) {
        throw new Error('Admin request is already pending');
    }
    this.adminRequest = {
        status: AdminRequestStatus.PENDING,
        requestDate: new Date()
    };
    await this.save();
};

// Middleware to clean up role-specific fields when role changes
UserSchema.pre('save', function(next) {
    if (this.isModified('role')) {
        if (this.role === 'user') {
            this.createdChallenges = [];
        } else if (this.role === 'admin') {
            this.completedChallenges = [];
            this.ongoingChallenges = [];
        }
    }
    next();
});

UserSchema.pre<IUserDocument>('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        logger.error('Error hashing password:', error);
        next(error as Error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Add validation
UserSchema.path('email').validate(async function(email: string) {
    const emailCount = await model('User').countDocuments({ email });
    return !emailCount;
}, 'Email already exists');

// Add method to get challenge count
UserSchema.methods.getChallengeCount = function(type: 'completed' | 'ongoing' | 'created'): number {
    switch(type) {
        case 'completed':
            return this.completedChallenges?.length || 0;
        case 'ongoing':
            return this.ongoingChallenges?.length || 0;
        case 'created':
            return this.createdChallenges?.length || 0;
        default:
            return 0;
    }
};

export default model<IUser>('User', UserSchema);


