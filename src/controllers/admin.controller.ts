import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const countSchoolAdmins = async (req: Request, res: Response) => {
    const totalAdmins = await prisma.user.count({
        where: {
            role: "SCHOOL_ADMIN",
        },
    });

    return res.json({
        totalAdmins,
    });
};