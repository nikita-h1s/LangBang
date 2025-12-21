import {Request, Response, NextFunction} from "express";
import {prisma} from "../lib/prisma";
import {Prisma} from "../../generated/prisma/client"
import {CourseLevel, EnrollmentCourseStatus} from "../../generated/prisma/enums";
import * as courseService from "../services/courses.service";

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
        const courses = await courseService.findAllCourses();

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

        const newCourse = await courseService.createCourse(
            {title, description, level, languageCode}
        )

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

        const newEnrollment = await prisma.enrollment.create({
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

// Course update
export const updateCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseId } = req.params;
        const { title, description, level } = req.body;

        const updatedCourse = await prisma.course.update({
            where: { courseId: parseInt(courseId) },
            data: {
                title,
                description,
                level
            }
        });

        res.status(200).json({
            message: 'Course updated successfully',
            course: updatedCourse
        })
    } catch (err) {
        next(err)
    }
};

// Course deletion
export const deleteCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseId } = req.params;

        await prisma.course.delete({
            where: { courseId: parseInt(courseId) }
        });

        res.status(204).json({
            message: 'Course deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};