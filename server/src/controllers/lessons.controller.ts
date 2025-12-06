import {Request, Response, NextFunction} from 'express';
import {prisma} from '../lib/prisma';

// Request body types
type lessonBody = {
    course_id: number;
    title: string;
    description: string;
    sequence: number;
}

// Create a new lesson in the database
export const createLesson = async (
    req: Request<{}, {}, lessonBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {course_id, title, description, sequence} = req.body;

        const newLesson = await prisma.lessons.create({
            data: {
                course_id,
                title,
                description,
                sequence
            }
        })

        res.status(201).json({
            message: 'Lesson created successfully',
            lesson: newLesson
        })
    } catch (err) {
        next(err)
    }
}

// Get a lesson from the database by ID
export const getLessons = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const course_id = req.params.id;

        const lessons = await prisma.lessons.findMany({
            where: {course_id: Number(course_id)}
        })

        res.status(200).json({
            message: 'Lessons fetched successfully',
            lessons
        })
    } catch (err) {
        next(err)
    }
}