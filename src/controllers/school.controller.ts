import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

export const createSchoolWithAdmin = async (req: Request, res: Response) => {
    try {
        if (req.user.role !== 'SUPER_ADMIN'){
            return res.status(403).json({error: "Acesso negado."})
        }

        const {
            schoolName, 
            schoolAdress,
            adminName,
            adminEmail,
            adminPhone,
            adminPassword
        } = req.body

        const result = await prisma.$transaction(async (tx) => {
            const school = await tx.school.create({
                data: {
                    name: schoolName,
                    address: schoolAdress
                }
            });

            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const admin = await tx.user.create({
                data: {
                    name: adminName,
                    email: adminEmail,
                    phone: adminPhone,
                    password: hashedPassword,
                    role: 'SCHOOL_ADMIN',
                    schoolId: school.id
                }
            });

            return {school, admin};
        });

        return res.status(201).json({
            message: "Escola e Administrador criados com sucesso!",
            data: result
        });
        
    }catch(error) {
        console.error(error);
        return res.status(500).json({error: "Erro ao criar escolas ou o nome já existe."});
    }
};