import {Request, Response, NextFunction} from 'express';
import {prisma} from '../lib/prisma';
import {ExerciseType} from '../../generated/prisma/enums'

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

        const newExercise = await prisma.exercises.create({
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

export const getExercises = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
   try {
       const lesson_id = req.params.id;

       const exercises = await prisma.exercises.findMany({
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