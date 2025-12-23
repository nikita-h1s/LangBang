import { Router } from 'express';
import {createLesson, getLessons,
    updateLesson, deleteLesson} from "../controllers/lessons.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";
import {
    createLessonSchema,
    updateLessonSchema
} from "../middlewares/validation/lesson.schema";
import {validate} from "../middlewares/validation/validate";

const router = Router();

router.post('/lessons', authenticateToken,
    requirePermission('manage_lesson'), validate(createLessonSchema), createLesson)
router.get('/courses/:id/lessons', authenticateToken, getLessons)
router.patch('/lessons/:id', authenticateToken,
    requirePermission('manage_lesson'), validate(updateLessonSchema), updateLesson);
router.delete('/lessons/:id', authenticateToken,
    requirePermission('manage_lesson'), deleteLesson);

export default router;