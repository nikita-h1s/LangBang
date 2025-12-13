import { Router } from 'express';
import {createLesson, getLessons,
    updateLesson, deleteLesson} from "../controllers/lessons.controller";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.post('/lessons', authenticateToken, createLesson)
router.get('/courses/:id/lessons', authenticateToken, getLessons)
router.patch('/lessons/:id', authenticateToken, updateLesson);
router.delete('/lessons/:id', authenticateToken, deleteLesson);

export default router;