import {Request, Response, NextFunction} from 'express';
import {Prisma} from '../../generated/prisma/client';
import {ConflictError} from "../services/auth.service";

// Custom error handler middleware
export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Check if an error is a Prisma error
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Check if an error is a unique constraint violation
        if (err.code === 'P2002') {
            return res.status(409).json({
                message: "Record with that unique field already exists.",
                error: err.message
            })
        }

        // Check if error is a database error
        return res.status(400).json({
            message: "Database error",
            error: err.meta
        });
    }

    // Check if an error is a ConflictError
    if (err instanceof ConflictError) {
        return res.status(409).json({
            message: "Conflict error",
            error: err.message
        })
    }

    // Check if an error is an instance of Error
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }

    // Fallback to unknown error
    return res.status(500).json({
        message: "Internal server error",
        error: "Unknown error"
    })
}