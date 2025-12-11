import express, {Router} from 'express';
import {getExercises, createExercise, exerciseProgress,
    updateExercise, deleteExercise} from "../controllers/exercises.controller";

const router = express.Router();

router.post('/exercises', createExercise);
router.get('/lessons/:id/exercises', getExercises);
router.post('/exercises/progress', exerciseProgress);
router.patch('/exercises/:id', updateExercise);
router.delete('/exercises/:id', deleteExercise);

export default router;