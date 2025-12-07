import express, {Router} from 'express';
import {getExercises, createExercise, exerciseProgress} from "../controllers/exercises.controller";

const router = express.Router();

router.post('/exercises', createExercise);
router.get('/lessons/:id/exercises', getExercises);
router.post('/exercises/progress', exerciseProgress);

export default router;