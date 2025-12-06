import express, {Router} from 'express';
import {getExercises, createExercise} from "../controllers/exercises.controller";

const router = express.Router();

router.post('/exercises', createExercise);
router.get('/lessons/:id/exercises', getExercises);

export default router;