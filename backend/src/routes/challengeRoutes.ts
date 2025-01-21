import { Router } from 'express';
import ChallengeController from '../controllers/ChallengeController';
import { protect, authorize } from '../middleware/auth';

const router = Router();
const challengeController = new ChallengeController();

// Public routes
router.get('/', challengeController.getAll);
router.get('/:id', challengeController.getById);
router.get('/stats', challengeController.getChallengeStats);
router.get('/search', challengeController.searchChallenges);

// Protected routes
router.use(protect);

// User routes
router.post('/:id/participate', challengeController.addParticipant);
router.get('/user/:userId', challengeController.getUserChallenges);

// Admin only routes
router.use(authorize('admin'));
router.post('/', challengeController.create);
router.patch('/:id', challengeController.update);
router.delete('/:id', challengeController.delete);
router.patch('/:id/status', challengeController.updateChallengeStatus);

export default router;
