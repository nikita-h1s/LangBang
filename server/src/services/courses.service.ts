import {prisma} from "../lib/prisma";
import {CourseLevel} from "../../generated/prisma/enums";

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
    data: {
        title: string,
        description: string,
        level: CourseLevel,
        languageCode: string
    }
) => {
    const language = await prisma.language.findUnique({
        where: {code: data.languageCode}
    })

    if (!language) {
        return new Error('Language not found');
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