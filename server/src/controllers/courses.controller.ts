import {Request, Response, NextFunction} from "express";
import {prisma} from "../lib/prisma";
import {CourseLevel} from "../../generated/prisma/enums";

// Request body types
type CourseBody = {
    title: string;
    description: string;
    level: CourseLevel;
    languageCode: string;
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
        const {title, description, level, languageCode} = req.body;

        const language = await prisma.languages.findUnique({
            where: {code: languageCode}
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
                targetLanguageId: language.id
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