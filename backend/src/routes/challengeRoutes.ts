import { Router } from 'express';
import ChallengeController from '../controllers/ChallengeController';
import { protect, authorize } from '../middleware/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     Challenge:
 *       type: object
 *       required:
 *         - Title
 *         - Deadline
 *         - contact_email
 *         - Project_Discription
 *         - Brief
 *         - Money_Prize
 *       properties:
 *         Title:
 *           type: string
 *           description: Challenge title
 *         Deadline:
 *           type: string
 *           format: date-time
 *           description: Challenge deadline
 *         contact_email:
 *           type: string
 *           format: email
 *         Project_Discription:
 *           type: string
 *         Brief:
 *           type: string
 *         Money_Prize:
 *           type: number
 *         status:
 *           type: string
 *           enum: [open, ongoing, completed]
 */

const router = Router();
const challengeController = new ChallengeController();

/**
 * @swagger
 * /challenges:
 *   get:
 *     summary: Get all challenges
 *     tags: [Challenges]
 *     responses:
 *       200:
 *         description: List of challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 */
router.get('/', challengeController.getAll);

/**
 * @swagger
 * /challenges/{id}:
 *   get:
 *     summary: Get challenge by ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Challenge details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       404:
 *         description: Challenge not found
 */
router.get('/:id', challengeController.getById);

/**
 * @swagger
 * /challenges:
 *   post:
 *     summary: Create a new challenge
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Challenge'
 *     responses:
 *       201:
 *         description: Challenge created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, challengeController.create);

// Public routes
router.get('/stats', challengeController.getChallengeStats);
router.get('/search', challengeController.searchChallenges);

// Protected routes
router.use(protect);
router.post('/:id/participate', challengeController.addParticipant);
router.get('/user/:userId', challengeController.getUserChallenges);

// Admin only routes
router.use(authorize('admin'));
router.patch('/:id', challengeController.update);
router.delete('/:id', challengeController.delete);
router.patch('/:id/status', challengeController.updateChallengeStatus);

export default router;
