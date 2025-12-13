import {prisma} from '../lib/prisma';
import {hashPassword, comparePassword} from "../utils/password";
import {RegisterInput} from "../middlewares/validation/auth.schema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {ENV} from '../config/env';

dotenv.config();

export class ConflictError extends Error {
    status = 409;
}

export const registerUser = async (data: RegisterInput) => {
    const existingUsername = await prisma.users.findUnique(
        {where: {username: data.username}}
    );

    if (existingUsername) {
        throw new ConflictError('Username already taken.');
    }

    const existingEmail = await prisma.users.findUnique({
        where: {email: data.email}
    })

    if (existingEmail) {
        throw new ConflictError('Email already in use.');
    }

    const hashedPassword = await hashPassword(data.password);

    return prisma.users.create({
        data: {
            username: data.username,
            email: data.email,
            passwordHash: hashedPassword,
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
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.users.findUnique({where: {email}});

    if (!user) {
        throw new ConflictError('Email not found.');
    }

    const isMatch = await comparePassword(password, user.passwordHash);

    if (!isMatch) {
        throw new ConflictError('Invalid password.');
    }

    // Generate JWT token
    const token = jwt.sign({
        userId: user.userId,
        role: user.role
    }, ENV.JWT_SECRET, {expiresIn: '24h'});

    return {
        token,
        user: {
            id: user.userId,
            email: user.email,
            username: user.username,
            role: user.role
        }
    };
}