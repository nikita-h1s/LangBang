import {prisma} from "../lib/prisma";
import {NotFoundError} from "../errors";
import {
    CreateCourseInput, EnrollCourseInput,
    UpdateCourseInput
} from "../middlewares/validation/course.schema";

export const findAllCourses = async () => {
    const coursesFromDb = await prisma.course.findMany({
        include: {
            language: true,
            _count: {select: {lessons: true}}
        }
    });

    return coursesFromDb.map(course => ({
        courseId: course.courseId,
        title: course.title,
        description: course.description,
        level: course.level,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        language: {
            id: course.language.id,
            code: course.language.code,
            name: course.language.name
        },
        lessonCount: course._count.lessons
    }));
};

export const createCourse = async (
    data: CreateCourseInput
) => {
    const language = await prisma.language.findUnique({
        where: {code: data.languageCode}
    })

    if (!language) {
        throw new NotFoundError('Language not found');
    }

    return prisma.course.create({
        data: {
            title: data.title,
            description: data.description,
            level: data.level,
            targetLanguageId: language.id
        }
    });
}

export const enrollForCourse = async (
    data: {userId: string} & EnrollCourseInput
) => {
    return prisma.enrollment.create({
        data: {
            userId: data.userId,
            courseId: data.courseId,
        }
    })
}

export const updateCourse = async (
    data: {courseId: string} & UpdateCourseInput
) => {
    const course = await prisma.course.findUnique({
        where: {courseId: parseInt(data.courseId)}
    })

    if (!course) {
        throw new NotFoundError('Course not found');
    }

    const languageCode = data.languageCode;
    let targetLanguageId: number | undefined = undefined;

    if (languageCode) {
        const language = await prisma.language.findUnique({
            where: {code: languageCode}
        })

        if (!language) {
            throw new NotFoundError('Language not found');
        }

        targetLanguageId = language.id;
    }

    return prisma.course.update({
        where: { courseId: parseInt(data.courseId) },
        data: {
            title: data.title,
            description: data.description,
            level: data.level,
            targetLanguageId: targetLanguageId
        }
    });
}

export const deleteCourse = async (courseId: string) => {
    const course = await prisma.course.findUnique({
        where: {courseId: parseInt(courseId)}
    })

    if (!course) {
        throw new NotFoundError('Course not found');
    }

    return prisma.course.delete({
        where: { courseId: parseInt(courseId)}
    });
}