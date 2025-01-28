import { Schema, model } from "mongoose";
import logger from "../utils/logger";

interface IVideo {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    duration: number;
    metadata?: {
        resolution?: string;
        format?: string;
        bitrate?: number;
    };
}

const VideoSchema = new Schema<IVideo>({
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
        enum: ['video/mp4', 'video/webm', 'video/quicktime']
    },
    size: {
        type: Number,
        required: [true, 'File size is required'],
        max: [104857600, 'File size cannot exceed 100MB'] // 100MB limit
    },
    duration: {
        type: Number,
        required: [true, 'Video duration is required'],
        max: [3600, 'Video duration cannot exceed 1 hour'] // 1 hour limit in seconds
    },
    metadata: {
        resolution: String,
        format: String,
        bitrate: Number
    }
}, {
    timestamps: true
});

// Indexes
VideoSchema.index({ filename: 'text' });
VideoSchema.index({ createdAt: -1 });

export default model<IVideo>('Video', VideoSchema);
