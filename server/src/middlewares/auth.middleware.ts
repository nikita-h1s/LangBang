import {NextFunction, Request, Response} from 'express'
import jwt, {JwtPayload} from "jsonwebtoken";
import {ENV} from '../config/env';

export const authenticateToken = (
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

    jwt.verify(token, ENV.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({message: "Access token expired or invalid."});
        }

        req.user = decoded as JwtPayload;
        next();
    })
}
