import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Request body types
type LessonBody = {
    courseId: number;
    title: string;
    description: string;
    sequence: number;
};

// Create a new lesson
export const createLesson = async (
    req: Request<{}, {}, LessonBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseId, title, description, sequence } = req.body;

        const newLesson = await prisma.lesson.create({
            data: { courseId, title, description, sequence }
        });

        res.status(201).json({
            message: 'Lesson created successfully',
            lesson: newLesson
        });
    } catch (err) {
        next(err);
    }
};

// Get lessons by course ID
export const getLessons = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const course_id = Number(req.params.id);

        const lessons = await prisma.lesson.findMany({
            where: { courseId: course_id },
            orderBy: { sequence: 'asc' }
        });

        res.status(200).json({
            message: 'Lessons fetched successfully',
            lessons
        });
    } catch (err) {
        next(err);
    }
};

// Update lesson
export const updateLesson = async (
    req: Request<{ id: string }, {}, Partial<LessonBody>>,
    res: Response,
    next: NextFunction
) => {
    try {
        const lessonId = Number(req.params.id);

        const updatedLesson = await prisma.lesson.update({
            where: { lessonId: lessonId },
            data: req.body
        });

        res.status(200).json({
            message: 'Lesson updated successfully',
            lesson: updatedLesson
        });
    } catch (err) {
        next(err);
    }
};

// Delete lesson
export const deleteLesson = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const lessonId = Number(req.params.id);

        await prisma.lesson.delete({
            where: { lessonId: lessonId }
        });

        res.status(200).json({
            message: 'Lesson deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
