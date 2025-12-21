import express from 'express';
import {getExercises, createExercise, exerciseProgress,
    updateExercise, deleteExercise} from "../controllers/exercises.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";
import {
    createExerciseSchema, exerciseProgressSchema, updateExerciseSchema
} from "../middlewares/validation/exerices.schema";
import {validate} from "../middlewares/validation/validate";

const router = express.Router();

router.post('/exercises', authenticateToken,
    requirePermission('manage_exercise'), validate(createExerciseSchema), createExercise);
router.get('/lessons/:id/exercises', authenticateToken,
    requirePermission('manage_exercise'), getExercises);
router.post('/exercises/progress', authenticateToken, validate(exerciseProgressSchema), exerciseProgress);
router.patch('/exercises/:id', authenticateToken,
    requirePermission('manage_exercise'), validate(updateExerciseSchema), updateExercise);
router.delete('/exercises/:id', authenticateToken,
    requirePermission('manage_exercise'), deleteExercise);

export default router;