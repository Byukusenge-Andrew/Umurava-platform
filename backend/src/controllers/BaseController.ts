import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';
import logger from '../utils/logger';

export default abstract class BaseController<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const items = await this.model.find();
            res.status(200).json(items);
        } catch (error) {
            logger.error('Error in getAll:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const item = await this.model.findById(req.params.id);
            if (!item) {
                res.status(404).json({ message: 'Item not found' });
                return;
            }
            res.status(200).json(item);
        } catch (error) {
            logger.error('Error in getById:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const item = await this.model.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            logger.error('Error in create:', error);
            res.status(400).json({ message: 'Invalid data provided' });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const item = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!item) {
                res.status(404).json({ message: 'Item not found' });
                return;
            }
            res.status(200).json(item);
        } catch (error) {
            logger.error('Error in update:', error);
            res.status(400).json({ message: 'Invalid data provided' });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const item = await this.model.findByIdAndDelete(req.params.id);
            if (!item) {
                res.status(404).json({ message: 'Item not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            logger.error('Error in delete:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}
