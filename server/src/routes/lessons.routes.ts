import { Router } from 'express';
import {createLesson, getLessons,
    updateLesson, deleteLesson} from "../controllers/lessons.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";

const router = Router();

router.post('/lessons', authenticateToken,
    requirePermission('manage_lesson'), createLesson)
router.get('/courses/:id/lessons', authenticateToken, getLessons)
router.patch('/lessons/:id', authenticateToken,
    requirePermission('manage_lesson'), updateLesson);
router.delete('/lessons/:id', authenticateToken,
    requirePermission('manage_lesson'), deleteLesson);

export default router;