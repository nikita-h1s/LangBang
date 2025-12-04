import {Request, Response, NextFunction} from 'express';
import {Prisma} from '../../generated/prisma/client';

// Custom error handler middleware
export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Check if error is a Prisma error
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
            message: "Database error",
            error: err.meta
        });
    }

    // Check if error is an instance of Error
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }

    // If none of the above, return a generic error
    return res.status(500).json({
        message: "Internal server error",
        error: "Unknown error"
    })
}