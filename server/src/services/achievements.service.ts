import {prisma} from "../lib/prisma.js";

export const grantAchievement = async (userId: string, achievementId: number) => {
    const existing = await prisma.userAchievement.findUnique({
        where: {
            userId_achievementId: {
                userId,
                achievementId
            }
        }
    });

    if (existing) {
        throw new Error('ACHIEVEMENT_ALREADY_GRANTED');
    }

    return prisma.userAchievement.create({
        data: {
            userId,
            achievementId
        }
    });
};

export const checkAndUnlockAchievements = async (userId: string) => {
    const stats = await prisma.exerciseProgress.aggregate({
        where: { userId, isCorrect: true },
        _count: { exerciseId: true },
        _sum: { earnedPoints: true }
    });

    const exercisesCount = stats._count.exerciseId || 0;
    const totalPoints = stats._sum.earnedPoints || 0;

    const existingAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true }
    });
    const existingIds = existingAchievements.map(ua => ua.achievementId);

    const potentialAchievements = await prisma.achievement.findMany({
        where: { achievementId: { notIn: existingIds } }
    });

    for (const achievement of potentialAchievements) {
        let isUnlocked = false;

        switch (achievement.conditionType) {
            case 'exercises_completed':
                if (exercisesCount >= (achievement.conditionValue || 0)) isUnlocked = true;
                break;
            case 'points_earned':
                if (totalPoints >= (achievement.conditionValue || 0)) isUnlocked = true;
                break;
        }

        if (isUnlocked) {
            await prisma.userAchievement.create({
                data: { userId, achievementId: achievement.achievementId }
            });
        }
    }
};