import {prisma} from "../lib/prisma";
import {
    UpdateProfileInput
} from "../middlewares/validation/user.schema.js";
import {ConflictError, NotFoundError} from "../errors";

export const getMyProfile = async (userId: string) => {
    return prisma.user.findUnique({
        where: {userId},
        select: {
            userId: true,
            username: true,
            email: true,
            role: true,
            avatarUrl: true,
            bio: true,
            nativeLanguage: {
                select: {
                    id: true,
                    code: true,
                    name: true
                }
            },
            createdAt: true
        }
    })
}

export const updateMyProfile = async (
    userId: string, data: UpdateProfileInput
) => {
    if (data.username) {
        const existing = await prisma.user.findUnique({where: {username: data.username}});
        if (existing && existing.userId !== userId) {
            throw new ConflictError('Username already taken');
        }
    }

    if (data.nativeLanguageId) {
        const language = await prisma.language.findUnique({where: {id: data.nativeLanguageId}});
        if (!language) {
            throw new NotFoundError('Invalid language');
        }
    }

    return prisma.user.update({
        where: {userId}, data: {
            username: data.username,
            bio: data.bio,
            avatarUrl: data.avatarUrl,
            nativeLanguageId: data.nativeLanguageId,
        }
    })
};

export const getMyStats = async (userId: string) => {
    const [
        totalPointsResult,
        exercisesCompleted,
        totalAttemptsResult,
        correctAttemptsResult,
        coursesEnrolled,
        achievementsCount,
    ] = await Promise.all([
        prisma.exerciseProgress.aggregate({
            where: {
                userId,
                isCorrect: true,
            },
            _sum: {
                earnedPoints: true,
            }
        }),
        prisma.exerciseProgress.findMany({
            where: {
                userId,
                isCorrect: true,
            },
            distinct: ['exerciseId'],
            select: {
                exerciseId: true,
            },
        }),
        prisma.exerciseProgress.aggregate({
            where: {userId},
            _count: {id: true},
        }),
        prisma.exerciseProgress.aggregate({
            where: {userId, isCorrect: true},
            _count: {id: true},
        }),
        prisma.enrollment.count({
            where: {userId},
        }),
        prisma.userAchievement.count({
            where: {userId},
        })
    ])

    const totalAttempts = totalAttemptsResult._count.id;
    const correctAttempts = correctAttemptsResult._count.id;

    return {
        totalPoints: totalPointsResult._sum.earnedPoints ?? 0,
        exercisesCompleted: exercisesCompleted.length,
        correctAnswersRate: totalAttempts === 0 ? 0
            : Math.round((correctAttempts / totalAttempts) * 100) / 100,
        coursesEnrolled,
        achievementsCount,
    };
};
