import {prisma} from "../lib/prisma";
import {NotFoundError} from "../errors";
import {
    CreateLessonInput,
    UpdateLessonInput
} from "../middlewares/validation/lesson.schema";

export const createLesson = async (
    data: CreateLessonInput
) => {
    return prisma.lesson.create({
        data: {
            courseId: data.courseId,
            title: data.title,
            description: data.description,
            sequence: data.sequence
        }
    });
}

export const getLessons = async (courseId: number) => {
    return prisma.lesson.findMany({
        where: {courseId: courseId},
        orderBy: {sequence: 'asc'}
    });
}

export const updateLesson = async (
    data: {lessonId: number} & UpdateLessonInput
) => {
    const lesson = await prisma.lesson.findUnique({
        where: { lessonId: data.lessonId }
    })

    if (!lesson) {
        throw new NotFoundError('Lesson not found');
    }

    return prisma.lesson.update({
        where: { lessonId: data.lessonId },
        data
    });
}

export const deleteLesson = async (lessonId: number) => {
    const lesson = await prisma.lesson.findUnique({
        where: { lessonId: lessonId }
    })

    if (!lesson) {
        throw new NotFoundError('Lesson not found');
    }

    return prisma.lesson.delete({
        where: { lessonId: lessonId }
    });
}