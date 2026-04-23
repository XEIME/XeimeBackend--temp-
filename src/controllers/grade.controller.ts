import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { GenerateGradesInput } from "../schemas/grade.schema";

export const generateGrades = async (req: Request, res: Response) => {
    try {
        const {start, end} = req.body as GenerateGradesInput;
        const schoolId = req.user.schoolId;

        if(!schoolId){
            return res.status(403).json({error: "Acesso negado. O seu utilizador não está vinculado a nenhuma escola."})
        }

        const gradeNames = [];
        for (let i = start; i <= end; i++) {
            gradeNames.push(`${i}ª Classe`);
        }

        //this create all the grades from the start to end 
        await prisma.$transaction(
            gradeNames.map((name) => 
            prisma.schoolGrade.upsert({
                where: {
                    name_schoolId: {
                        name: name,
                        schoolId: schoolId,
                    },
                },
                update: {}, //If it already exists, it doesn't change anything.
                create: {
                    name: name,
                    schoolId: schoolId,
                },
            })
        )   
        );

        return res.status(201).json({
            message: `As classes de ${start}ª à ${end}ª foram configuradas com sucesso.`
        })

    }catch(error){
        console.error("erro ao gerar as classes: ", error);
        return res.status(500).json({error: "erro interno ao processar o intervalo de classes."})
    }
};

//list grades
export const getGrades = async (req: Request, res: Response) => {
    try {
        const schoolId = req.user.schoolId;

        if(!schoolId){
            return res.status(403).json({error: "Acesso negado. O seu utilizador não está vinculado a nenhuma escola."})
        }

        const grades = await prisma.schoolGrade.findMany({
            where: { schoolId},
            orderBy: {name: 'asc'},
            include: {
                _count: {
                    select: { schoolclasses: true}
                }
            }
        });

        return res.status(200).json(grades);
    }catch(error){
        return res.status(500).json({error: "Erro ao tentar listar as classes"})
    }
};