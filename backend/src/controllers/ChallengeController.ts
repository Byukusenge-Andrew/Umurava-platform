import { Request, Response } from 'express';
import { Model } from 'mongoose';
import BaseController from './BaseController';
import Challenge from '../models/Challenge';
import { IChallenge, ChallengeStatus } from '../types';
import logger from '../utils/logger';

interface IChallengeModel extends Model<IChallenge> {
    getChallengeStats(): Promise<{
        total: number;
        open: number;
        ongoing: number;
        completed: number;
    }>;
    getUserChallengeStats(userId: number): Promise<{
        total: number;
        open: number;
        ongoing: number;
        completed: number;
    }>;
}

export default class ChallengeController extends BaseController<IChallenge> {
    challengeService: any;
    constructor() {
        super(Challenge as unknown as Model<IChallenge>);
    }

    getChallengeStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const stats = await (Challenge as unknown as IChallengeModel).getChallengeStats();
            res.status(200).json(stats);
        } catch (error) {
            logger.error('Error in getChallengeStats:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getUserChallenges = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;
            const stats = await (Challenge as unknown as IChallengeModel).getUserChallengeStats(Number(userId));
            res.status(200).json(stats);
        } catch (error) {
            logger.error('Error in getUserChallenges:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    updateChallengeStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!Object.values(ChallengeStatus).includes(status)) {
                res.status(400).json({ message: 'Invalid status' });
                return;
            }

            const challenge = await Challenge.findById(id);
            if (!challenge) {
                res.status(404).json({ message: 'Challenge not found' });
                return;
            }

            await challenge.updateStatus(status);
            res.status(200).json(challenge);
        } catch (error) {
            logger.error('Error in updateChallengeStatus:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    addParticipant = async (req: Request, res: Response): Promise<void> => {
        try {
            const challenge = await Challenge.findById(req.params.id);
            if (!challenge) {
                res.status(404).json({ message: 'Challenge not found' });
                return;
            }

            if (!challenge.isActive()) {
                res.status(400).json({ message: 'Challenge is not active' });
                return;
            }

            await challenge.addParticipant();
            res.status(200).json(challenge);
        } catch (error) {
            logger.error('Error in addParticipant:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    searchChallenges = async (req: Request, res: Response): Promise<void> => {
        try {
            const { query } = req.query; // Get search query from request
            const challenges = await this.challengeService.searchChallenges(query as string);
            res.status(200).json(challenges);
        } catch (error) {
            logger.error('Error in searchChallenges:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}
