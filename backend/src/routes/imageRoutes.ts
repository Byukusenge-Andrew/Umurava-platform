import { Router } from 'express';
import { Response, NextFunction } from 'express';
import {  uploadImage } from '../middleware/upload';
import ImageController from '../controllers/ImageController';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const imageController = new ImageController();

// Type-safe route handlers
const uploadHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    return imageController.upload(req, res, next);
};

const deleteHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    return imageController.delete(req, res, next);
};

// Routes
router.use(protect);
router.post('/upload', uploadImage.single('file'), (req, res, next) => {
    uploadHandler(req as AuthRequest, res, next);
});
router.get('/', (req, res, next) => {
    imageController.getUserImages(req as AuthRequest, res, next);
});
router.delete('/:id', (req, res, next) => {
    deleteHandler(req as AuthRequest, res, next);
});

export default router;
