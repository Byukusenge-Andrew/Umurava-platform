import { Schema, model, Types, Document } from "mongoose";
import logger from "../utils/logger";

// TODO: For cloud storage adaptation:
// 1. Update schema to include cloud storage specific fields:
//   - cloudStorageUrl: String (full URL to access file)
//   - cloudStorageKey: String (unique identifier in cloud storage)
//   - cloudProvider: String (e.g., 'aws', 'gcp')
// 2. Update methods to handle cloud storage paths
// 3. Add cloud-specific metadata fields

interface IImage extends Document {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    uploadedBy: Types.ObjectId;
    uploadDate: Date;
    metadata?: {
        width?: number;
        height?: number;
        format?: string;
    };
    canModify(userId: Types.ObjectId): boolean;
}

const ImageSchema = new Schema<IImage>({
    filename: {
        type: String,
        required: [true, 'Filename is required'],
        trim: true
    },
    path: {
        type: String,
        required: [true, 'File path is required'],
        unique: true
    },
    mimetype: {
        type: String,
        required: [true, 'File type is required'],
        enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    size: {
        type: Number,
        required: [true, 'File size is required'],
        max: [5242880, 'File size cannot exceed 5MB'] // 5MB limit
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Uploader reference is required']
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    metadata: {
        width: Number,
        height: Number,
        format: String
    }
}, {
    timestamps: true
});

// Indexes
ImageSchema.index({ uploadedBy: 1 });
ImageSchema.index({ uploadDate: -1 });

// Method to check if user can modify image
ImageSchema.methods.canModify = function(userId: Types.ObjectId): boolean {
    return this.uploadedBy.equals(userId);
};

export default model<IImage>('Image', ImageSchema);
