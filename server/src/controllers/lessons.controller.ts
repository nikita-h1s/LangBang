import { Request, Response, NextFunction } from 'express';
import * as lessonService from '../services/lessons.service';
import {UpdateLessonInput} from "../middlewares/validation/lesson.schema";

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

        const newLesson = await lessonService.createLesson(
            { courseId, title, description, sequence }
        );

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
        const courseId = Number(req.params.id);

        const lessons = await lessonService.getLessons(courseId);

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
    req: Request<{ id: string }, {}, UpdateLessonInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const lessonId = Number(req.params.id);
        const reqBody = req.body;

        const updatedLesson = lessonService.updateLesson({lessonId, ...reqBody})

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

        await lessonService.deleteLesson(lessonId);

        res.status(200).json({
            message: 'Lesson deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
