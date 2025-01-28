import { Request, Response, NextFunction } from 'express';
import Video from '../models/Video';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import logger from '../utils/logger';

class VideoController {
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: videos });
    });

    upload = asyncHandler(async (req: Request, res: Response) => {
        if (!req.file) {
            throw new ErrorResponse('Please upload a video file', 400);
        }

        const video = await Video.create({
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            duration: req.body.duration || 0,
            metadata: {
                resolution: req.body.resolution,
                format: req.body.format,
                bitrate: req.body.bitrate
            }
        });

        res.status(201).json({ success: true, data: video });
    });

    delete = asyncHandler(async (req: Request, res: Response) => {
        const video = await Video.findById(req.params.id);
        
        if (!video) {
            throw new ErrorResponse('Video not found', 404);
        }

        // Add authorization check if needed
        await video.deleteOne();
        res.status(200).json({ success: true, data: {} });
    });
}

export default VideoController;
