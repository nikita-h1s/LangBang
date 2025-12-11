import {Request, Response, NextFunction} from 'express';
import {prisma} from '../lib/prisma';

// Request body types
type LanguageBody = {
    code: string;
    name: string;
}

// Add a new language to the database
export const addLanguage = async (
    req: Request<{}, {}, LanguageBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {code, name} = req.body;

        const newLanguage = await prisma.languages.create({
            data: {
                code,
                name
            }
        })

        res.status(201).json({
            message: 'Language created successfully',
            language: newLanguage
        })
    } catch (err) {
        next(err)
    }
}

// Get all languages from the database
export const getLanguages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const languages = await prisma.languages.findMany({
            select: {
                id: true,
                code: true,
                name: true
            }
        });

        res.status(200).json({
            message: 'Languages fetched successfully',
            languages
        })
    } catch (err) {
        next(err)
    }
}

// Grant a language to a user
export const grantLanguageToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId, languageId} = req.params;

        const user = await prisma.users.findUnique({where: {userId}});
        const language = await prisma.languages.findUnique({where: {id: Number(languageId)}});

        if (!user || !language) {
            return res.status(404).json({
                message: 'User or language not found.'
            })
        }

        const existing = await prisma.userLanguages.findUnique({
            where: {
                userId_languageId: {
                    userId,
                    languageId: Number(languageId)
                }
            }
        });

        if (existing) {
            return res.status(409).json({
                message: 'Language already granted to user.'
            })
        }

        const newUserLanguage = await prisma.userLanguages.create({
            data: {
                userId,
                languageId: Number(languageId),
            }
        });

        res.status(201).json(
            {
                message: 'Language granted successfully.',
                userLanguage: newUserLanguage
            }
        )
    } catch (err) {
        next(err)
    }
}

// Get user languages
export const getUserLanguages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = req.params;

        const user = await prisma.users.findUnique({where: {userId}});

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            })
        }

        const userLanguages = await prisma.userLanguages.findMany(
            {
                where: {userId},
                select: {
                    userId: true,
                    languages: true
                }
            }
        )

        res.status(200).json({
            message: 'User languages fetched successfully.',
            userLanguages
        })
    } catch (err) {
        next(err)
    }
}

// Update language
export const updateLanguage = async (
    req: Request<{ id: string }, {}, Partial<LanguageBody>>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        const updated = await prisma.languages.update({
            where: { id },
            data: req.body
        });

        res.status(200).json({
            message: 'Language updated successfully',
            language: updated
        });
    } catch (err) {
        next(err);
    }
};

// Delete language
export const deleteLanguage = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        await prisma.languages.delete({
            where: { id }
        });

        res.status(200).json({
            message: 'Language deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};