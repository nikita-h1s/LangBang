import {NextFunction, Request, type Response} from 'express'
import {registerSchema, loginSchema, LoginInput} from './auth.schema';
import {z} from 'zod';

export const validateRegister = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: z.treeifyError(parsed.error)
        })
    }

    req.body = parsed.data;
    next();
}

export const validateLogin = (
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation error",
            errors: z.treeifyError(parsed.error)
        })
    }

    req.body = parsed.data;
    next();
}