import {NextFunction, Request, Response} from 'express'
import {prisma} from "../lib/prisma.js";
import * as userService from "../services/users.service.js";


export const updateUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params;
        const {role} = req.body;

        await prisma.user.update({
            where: {userId: id},
            data: {
                role,
                tokenVersion: {increment: 1}
            }
        })

        res.status(200).json({message: "User role updated successfully."});
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params;

        const deletedUser = await prisma.user.delete({where: {userId: id}});

        res.status(200).json({
            message: "User deleted successfully.",
            deletedUser
        });
    } catch (err) {
        next(err);
    }
}

export const getMyProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;

        const fetchedUser = await userService.getMyProfile(user!.userId);

        res.status(200).json({
            message: "User fetched successfully.",
            user: fetchedUser
        });
    } catch (err) {
        next(err);
    }
}

export const updateMyProfile = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const updatedFields = req.body;

        const user = req.user;

        const updatedUser = await userService.updateMyProfile(
            user!.userId, updatedFields
        );

        res.status(200).json({
            message: "User updated successfully.",
            user: updatedUser
        })
    } catch (err) {
        next(err);
    }
};

export const getMyStats = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const user = req.user;

        const userStats = await userService.getMyStats(user!.userId);

        res.status(200).json({
            message: "User stats fetched successfully.",
            userStats
        })
    } catch (err) {
        next(err);
    }
};