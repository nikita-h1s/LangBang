import express, {Router} from 'express';
import {getExercises, createExercise, exerciseProgress,
    updateExercise, deleteExercise} from "../controllers/exercises.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";

const router = express.Router();

router.post('/exercises', authenticateToken,
    requirePermission('manage_exercise'), createExercise);
router.get('/lessons/:id/exercises', authenticateToken,
    requirePermission('manage_exercise'), getExercises);
router.post('/exercises/progress', authenticateToken, exerciseProgress);
router.patch('/exercises/:id', authenticateToken,
    requirePermission('manage_exercise'), updateExercise);
router.delete('/exercises/:id', authenticateToken,
    requirePermission('manage_exercise'), deleteExercise);

export default router;