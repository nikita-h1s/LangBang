import {prisma} from '../lib/prisma';
import {hashPassword, comparePassword} from "../utils/password";
import {RegisterInput} from "../middlewares/validation/auth.schema";
import dotenv from "dotenv";
import {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} from "../utils/token";
import jwt from "jsonwebtoken";
import {ENV} from "../config/env";

dotenv.config();

export class ConflictError extends Error {
    status = 409;
}

export const registerUser = async (data: RegisterInput) => {
    const existingUsername = await prisma.user.findUnique(
        {where: {username: data.username}}
    );

    if (existingUsername) {
        throw new ConflictError('Username already taken.');
    }

    const existingEmail = await prisma.user.findUnique({
        where: {email: data.email}
    })

    if (existingEmail) {
        throw new ConflictError('Email already in use.');
    }

    const hashedPassword = await hashPassword(data.password);

    return prisma.user.create({
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
    const user = await prisma.user.findUnique({where: {email}});

    if (!user) {
        throw new ConflictError('Email not found.');
    }

    const isMatch = await comparePassword(password, user.passwordHash);

    if (!isMatch) {
        throw new ConflictError('Invalid password.');
    }

    const permissions = await prisma.rolePermission.findMany({
        where: {role: user.role},
        include: {permission: true}
    })

    const permissionCodes = permissions.map(p => p.permission.code);

    const refreshToken = generateRefreshToken({userId: user.userId});

    await prisma.refreshToken.create({
        data: {
            tokenHash: hashToken(refreshToken),
            userId: user.userId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        }
    })

    const accessToken = generateAccessToken({
        userId: user.userId,
        role: user.role,
        permissions: permissionCodes
    })

    return {
        refreshToken,
        accessToken,
        user: {
            id: user.userId,
            email: user.email,
            username: user.username,
            role: user.role
        }
    };
}

export const refreshAccessToken = async (refreshToken?: string) => {
    if (!refreshToken) {
        throw new Error('No refresh token provided.');
    }

    const payload = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) as {userId: string};

    const tokenHash = hashToken(refreshToken);

    const existingToken = await prisma.refreshToken.findUnique(
        {where: {tokenHash}}
    );

    if (!existingToken) {
        throw new Error('Invalid refresh token.');
    }

    const user = await prisma.user.findUnique({where: {userId: payload.userId}});

    if (!user) {
        throw new Error('User not found.');
    }

    const permissions = await prisma.rolePermission.findMany({
        where: {role: user.role},
        include: {permission: true}
    })

    return generateAccessToken({
        userId: user.userId,
        role: user.role,
        permissions: permissions.map(p => p.permission.code)
    })
}