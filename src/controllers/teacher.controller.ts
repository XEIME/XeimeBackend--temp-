import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums";

export const createTeacher = async (req: Request, res: Response) => {
    try {
        const {
            teacherName,
            teacherEmail,
            teacherPhone,
            teacherPassword
        } = req.body;
        const schoolId = req.user.schoolId
        const role = Role.TEACHER;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: teacherEmail},
                    {phone: teacherPhone}
                ]
            }
        })

        if(existingUser){
            return res.status(400).json({
                message: "Este e-mail ou número de telefone já está em uso por outro utilizador."
            });
        }

        const hashedPassword = await bcrypt.hash(teacherPassword, 10);

        const teacher = await prisma.user.create({
            data: {
                name: teacherName,
                email: teacherEmail,
                phone: teacherPhone,
                password: hashedPassword,
                schoolId,
                role,
            },
            select: { id: true, name: true, email: true, role: true }
        });

        return res.status(201).json({message: "o professor foi criado com sucesso.", teacher});

    }catch(error){
        console.error(error);
        return res.status(500).json({error: "Erro ao tentar cadastrar o professor"})
    }
}