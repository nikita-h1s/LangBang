import {Request, Response, NextFunction} from "express";
import {prisma} from "../lib/prisma";
import {Prisma} from "../../generated/prisma/client"
import {CourseLevel, EnrollmentCourseStatus} from "../../generated/prisma/enums";

// Request body types
type CourseBody = {
    title: string;
    description: string;
    level: CourseLevel;
    languageCode: string;
}

type EnrollmentBody = {
    userId: string,
    courseId: number,
    status: EnrollmentCourseStatus,
    progress: number,
    completedAt: string,
    lastLessonId: number
}

// Get all courses from the database
export const getAllCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const coursesFromDb = await prisma.courses.findMany({
            include: {
                languages: true,
                _count: {select: {lessons: true}}
            }
        });

        const courses = coursesFromDb.map(course => ({
            courseId: course.courseId,
            title: course.title,
            description: course.description,
            level: course.level,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            language: {
                id: course.languages.id,
                code: course.languages.code,
                name: course.languages.name
            },
            lessonCount: course._count.lessons
        }))

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

export const enrollForCourse = async (
    req: Request<{}, {}, EnrollmentBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            userId, courseId
        } = req.body;

        const newEnrollment = await prisma.enrollments.create({
            data: {
                userId,
                courseId,
                progress: 0,
            }
        })

        res.status(201).json({
            message: 'Successfully enrolled in the course',
            enrollment: newEnrollment
        })
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            return res.status(409).json({
               message: "User is already enrolled in the course",
            });
        }
        next(err);
    }
}