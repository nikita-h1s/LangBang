import {NextFunction, Request, Response} from 'express'
import jwt, {JwtPayload} from "jsonwebtoken";
import {ENV} from '../config/env';
import {prisma} from "../lib/prisma";

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as JwtPayload;

        const user = await prisma.user.findUnique({where: {userId: decoded.userId}});

        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        if (decoded.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({message: "Access token expired or invalid."});
        }

        req.user = decoded;
        next();
    } catch (err) {
        next(err);
    }
}
