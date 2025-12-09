import {NextFunction, Request, type Response} from 'express'
import {prisma} from '../lib/prisma'

// Request body types
interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

// Register a new user
export const register = async (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) => {
    try {
        const {username, email, password} = req.body;

        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                passwordHash: password,
                role: 'user'
            },
            select: {
                userId: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                role: true
            }
        });

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (err) {
        next(err)
    }
}

// Log in a user
export const login = async (
    req: Request<{}, {}, LoginBody>,
    res: Response, next: NextFunction
) => {
    try {
        const {email, password} = req.body;

        const user = await prisma.users.findUnique({
            where: {email}
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const {passwordHash, ...safeUser} = user;

        if (user.passwordHash === password) {
            res.status(200).json({
                message: 'Login successful',
                user: safeUser
            })
        } else {
            res.status(401).json({
                message: 'Invalid credentials'
            })
        }
    } catch (err) {
        next(err)
    }
}
