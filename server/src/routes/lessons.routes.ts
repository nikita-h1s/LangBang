import { Router } from 'express';
import {createLesson, getLessons} from "../controllers/lessons.controller";

const router = Router();

router.post('/lessons', createLesson)
router.get('/courses/:id/lessons', getLessons)

export default router;