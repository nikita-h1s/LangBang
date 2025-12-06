import {Request, Response, NextFunction} from 'express';
import {prisma} from '../lib/prisma';
import {exercise_type} from '../../generated/prisma/enums'

type ExerciseBody = {
    lesson_id: number,
    type: exercise_type,
    question: string,
    metadata: object,
    points: number,
    correct_answer: string,
    media_url: string,
    sequence: number,
}

export const createExercise = async (
    req: Request<{}, {}, ExerciseBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            lesson_id, type, question, metadata,
            correct_answer, points, media_url, sequence,
        } = req.body;

        const newExercise = await prisma.exercises.create({
            data: {
                lesson_id,
                type,
                question,
                metadata: metadata || {},
                points,
                correct_answer,
                media_url,
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
               lesson_id: Number(lesson_id),
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