import { Router } from 'express';
import {createLesson, getLessons,
    updateLesson, deleteLesson} from "../controllers/lessons.controller";

const router = Router();

router.post('/lessons', createLesson)
router.get('/courses/:id/lessons', getLessons)
router.patch('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

export default router;