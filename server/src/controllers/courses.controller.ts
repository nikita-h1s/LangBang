import {Request, Response, NextFunction} from "express";
import {prisma} from "../lib/prisma";
import {course_level} from "../../generated/prisma/enums";

// Request body types
type CourseBody = {
    title: string;
    description: string;
    level: course_level;
    language_code: string;
}

// Get all courses from the database
export const getAllCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const courses = await prisma.courses.findMany({
            include: {
                languages: true,
                _count: {select: {lessons: true}}
            }
        });

        res.status(200).json({
            message: 'Courses fetched successfully',
            courses
        })
    } catch (err) {
        next(err)
    }
}

// Create a new course in the database
export const createCourse = async (
    req: Request<{}, {}, CourseBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {title, description, level, language_code} = req.body;

        const language = await prisma.languages.findUnique({
            where: {code: language_code}
        })

        if (!language) {
            return res.status(400).json({
                message: 'Language not found'
            })
        }

        const newCourse = await prisma.courses.create({
            data: {
                title,
                description,
                level,
                target_language_id: language.id
            }
        });

        res.status(201).json({
            message: 'Course created successfully',
            course: newCourse
        })
    } catch (err) {
        next(err)
    }
}