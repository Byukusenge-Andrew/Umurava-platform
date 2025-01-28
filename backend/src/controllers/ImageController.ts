import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Image from '../models/Image';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import { AuthRequest, IUser } from '../types';
import { ObjectId } from 'mongodb';

// TODO: For cloud storage integration:
// 1. Update file paths to use cloud storage URLs
// 2. Add cloud storage cleanup on delete
// 3. Update error handling for cloud operations
// 4. Add proper URL generation for stored files
// Example cloud configuration:
// const cloudConfig = {
//   bucket: process.env.CLOUD_BUCKET,
//   region: process.env.CLOUD_REGION,
//   baseUrl: process.env.CLOUD_BASE_URL
// };

class ImageController {
    upload = asyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.file || !req.user) {
            throw new ErrorResponse('Please upload an image file and login', 400);
        }

        const image = await Image.create({
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user._id,
            metadata: {
                width: req.body.width,
                height: req.body.height,
                format: req.body.format
            }
        });

        res.status(201).json({ success: true, data: image });
    });

    getUserImages = asyncHandler(async (req: AuthRequest, res: Response) => {
        const images = await Image.find({ 
            uploadedBy: req.user?._id 
        }).sort({ uploadDate: -1 });
        
        res.status(200).json({ success: true, data: images });
    });

    delete = asyncHandler(async (req: AuthRequest, res: Response) => {
        const image = await Image.findById(req.params.id);
        
        if (!image) {
            throw new ErrorResponse('Image not found', 404);
        }

        if (!req.user || !image.canModify(req.user._id)) {
            throw new ErrorResponse('Not authorized to delete this image', 403);
        }

        await image.deleteOne();
        res.status(200).json({ success: true, data: {} });
    });
}

export default ImageController;
