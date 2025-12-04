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