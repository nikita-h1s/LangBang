import {Request, Response, NextFunction} from 'express';
import {prisma} from '../lib/prisma';

// Reques body types
type AchievementBody = {
    code: string,
    title: string,
    description: string,
    category: string,
    iconUrl: string,
    conditionType: string,
    conditionValue: number
}

type GrantAchievementBody = {
    userId: string,
    achievementId: number
}

// Creates a new achievement
export const createAchievement = async (
    req: Request<{}, {}, AchievementBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            code, title, description, category,
            iconUrl, conditionType, conditionValue
        } = req.body;

        const newAchievement = await prisma.achievements.create({
            data: {
                code,
                title,
                description,
                category,
                iconUrl,
                conditionType,
                conditionValue
            }
        })

        res.status(201).json({
            message: 'Achievement created successfully.',
            achievement: newAchievement
        });
    } catch (err) {
        next(err);
    }
}

export const getUserAchievements = async (
    req: Request<{userId: string}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = req.params;

        const userAchievements = await prisma.userAchievements.findMany({
            where: {userId},
            include: {
                achievements: true
            }
        })

        res.status(200).json({
            message: 'User achievements fetched successfully.',
            userAchievements
        })
    } catch (err) {
        next(err);
    }
}

export const grantAchievementToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId, achievementId} = req.params;

        const existing = await prisma.userAchievements.findUnique({
            where: {
                userId_achievementId: {
                    userId,
                    achievementId: Number(achievementId)
                }
            }
        })

        if (existing) {
            return res.status(409).json({
                message: 'Achievement already granted to user.'
            })
        }

        const newUserAchievement = await prisma.userAchievements.create({
            data: {
                userId,
                achievementId: Number(achievementId),
            }
        });

        res.status(201).json({
            message: 'Achievement granted successfully.',
            userAchievement: newUserAchievement
        });
    } catch (err) {
        next(err);
    }
}