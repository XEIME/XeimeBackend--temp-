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

export const listSchools = async (req: Request, res: Response) => {
    try {
         if (req.user.role !== 'SUPER_ADMIN'){
            return res.status(403).json({error: "Acesso negado."})
        }

        const schoolList = await prisma.school.findMany({});
        
        // if(schoolList.length === 0){
        //     return res.json("Nenhuma escola encontrada no sistema.")
        // }

        return res.json({
            schoolList
        });
    }catch(error){
        return res.status(500).json({error: "Erro ao tentar carregar a lisat das escoals."})
    }
};

export const getSchoolsDetalhes = async (req: Request, res: Response) => {
    try {
        if (req.user.role !== 'SUPER_ADMIN'){
            return res.status(403).json({error: "Acesso negado."})
        }

        const {id} = req.params;

        if(!id || typeof id !== 'string'){
            return res.status(400).json({error: "ID da escola é obrigatório."})
        }

        const schoolDetalhes = await prisma.school.findUnique({
            where: {id: id},
            include: {
                users: {
                  where: {
                    role: 'SCHOOL_ADMIN'
                  },
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  }
                }
            }
        });

        if(!schoolDetalhes){
            return res.status(404).json({error: "Escola não encontrada."})
        }

        return res.json({
            message: "Detalhes da escola carregados",
            data: schoolDetalhes
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({error: "Erro ao tentar buscar detalhes da escola "})
    }
}