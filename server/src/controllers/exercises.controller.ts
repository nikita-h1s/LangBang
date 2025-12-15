import {Request, Response, NextFunction} from 'express';
import {prisma} from '../lib/prisma';
import {ExerciseType} from '../../generated/prisma/enums'

// Request body types
type ExerciseBody = {
    lessonId: number,
    type: ExerciseType,
    question: string,
    metadata: object,
    points: number,
    correctAnswer: string,
    mediaUrl: string,
    sequence: number,
}

type ExerciseProgressBody = {
    userId: string,
    exerciseId: number,
    isCorrect: boolean,
    earnedPoints: number,
    attemptNumber: number
}

// Create a new exercise
export const createExercise = async (
    req: Request<{}, {}, ExerciseBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            lessonId, type, question, metadata,
            correctAnswer, points, mediaUrl, sequence,
        } = req.body;

        const newExercise = await prisma.exercise.create({
            data: {
                lessonId,
                type,
                question,
                metadata: metadata || {},
                points,
                correctAnswer,
                mediaUrl,
                sequence
            }
        })

        res.status(200).json({
            message: 'Exercise created successfully.',
            exercise: newExercise,
        });
    } catch (err) {
        next(err)
    }
}

// Get exercises for a lesson
export const getExercises = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
   try {
       const lesson_id = req.params.id;

       const exercises = await prisma.exercise.findMany({
           where: {
               lessonId: Number(lesson_id),
           }
       })

       res.status(200).json({
           message: 'Exercises fetched successfully.',
           exercises,
       })
   } catch (err) {
       next(err)
   }
}

// Record exercise progress
export const exerciseProgress = async (
    req: Request<{}, {}, ExerciseProgressBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            userId, exerciseId, isCorrect,
            earnedPoints, attemptNumber
        } = req.body;

        const newExerciseProgress = await prisma.exerciseProgress.create({
            data: {
               userId,
               exerciseId,
               isCorrect,
               earnedPoints,
               attemptNumber,
            }
        })

        res.status(201).json({
            message: 'Exercise progress recorded successfully.',
            exerciseProgress: newExerciseProgress,
        })
    } catch (err) {
        next(err)
    }
}

// Update exercise
export const updateExercise = async (
    req: Request<{ id: string }, {}, Partial<ExerciseBody>>,
    res: Response,
    next: NextFunction
) => {
    try {
        const exerciseId = Number(req.params.id);

        const updated = await prisma.exercise.update({
            where: { exerciseId },
            data: req.body
        });

        res.status(200).json({
            message: "Exercise updated successfully.",
            exercise: updated
        });
    } catch (err) {
        next(err);
    }
};

// Delete exercise
export const deleteExercise = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const exerciseId = Number(req.params.id);

        await prisma.exercise.delete({
            where: { exerciseId }
        });

        res.status(200).json({
            message: "Exercise deleted successfully."
        });
    } catch (err) {
        next(err);
    }
};
