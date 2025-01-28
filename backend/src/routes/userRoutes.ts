import { Router } from 'express';
import { RequestHandler } from 'express';
import UserController from '../controllers/UserController';
import { protect, authorize, isSuperAdmin } from '../middleware/auth';
import { upload } from '../utils/gridfs';
import { File } from '../types';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/login', userController.login);
router.post('/register', userController.create);
router.post(
    '/profile/picture',
    upload.single('profile') as RequestHandler,
    userController.uploadProfilePicture as RequestHandler
);
// Protected routes
router.use(protect); // All routes below this will be protected

// User routes
router.get('/profile', userController.getById);
router.patch('/profile', userController.updateUser);

router.get('/stats', userController.getUserStats);

// Admin request routes
router.post('/request-admin', userController.requestAdminRole);

// Super admin routes
router.use(isSuperAdmin); // All routes below this will require super admin
router.get('/pending-admin-requests', userController.getPendingAdminRequests);
router.patch('/process-admin-request/:userId', userController.processAdminRequest);

// Admin only routes
router.use(authorize('admin'));
router.get('/', userController.getAll);
router.delete('/:id', userController.delete);
router.get('/search', userController.searchUsers); // Admin search

export default router;
