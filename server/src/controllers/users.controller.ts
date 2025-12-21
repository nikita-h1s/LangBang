import {NextFunction, Request, Response} from 'express'
import {prisma} from "../lib/prisma";

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