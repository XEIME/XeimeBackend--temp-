import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { CreateSchoolInput, UpdateSchoolInput } from "../schemas/school.schema";


export const createSchoolWithAdmin = async (req: Request, res: Response) => {
    try {
        const {
            schoolName, 
            schoolAdress,
            adminName,
            adminEmail,
            adminPhone,
            adminPassword
        } = req.body as CreateSchoolInput;

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
        
    }catch(error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Este nome de escola ou email de administrador já está em uso." });
        }
        // console.error(error);
        return res.status(500).json({error: "Erro ao criar escolas ou o nome já existe."});
    }
};

export const listSchools = async (req: Request, res: Response) => {
    try {
        

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


/**
 * Updates school information and its associated administrator.
 * * @param req - Express Request object containing the school ID in params 
 * and partial school/admin data in the body.
 * @param res - Express Response object.
 */
 export const schoolupdate = async (req: Request, res: Response) => {
    try{
        
        const {id} = req.params;

         if(!id || typeof id !== 'string'){
            return res.status(400).json({error: "ID da escola é obrigatório."})
        }

        // Using Type Casting to ensure we have IntelliSense for the validated body
        const {
            schoolName, 
            schoolAdress,
            adminName,
            adminEmail,
            adminPhone,
        } = req.body as UpdateSchoolInput
        
        //Fetch the existing school along with its SCHOOL_ADMIN
        const school = await prisma.school.findUnique({
            where: {
                id: id
            },
            include: {
                users: {
                    where: {
                        role: 'SCHOOL_ADMIN'
                    },
                    select: {
                        id: true,
                    }
                }
            }
        })

        //Check if the school exists in the database
        if(!school){
            return res.status(404).json({message: "Escola não encontrada"})
        }

        const admin = school.users[0]

        if(!admin){
            return res.status(404).json({message: "Esta escola não possui um administrador cadastrado"})
        }

        /**
         * Dynamic Object Construction:
         * I build the adminUpdateData object manually to avoid passing 'undefined' 
         * values, which would trigger TypeScript errors due to 'exactOptionalPropertyTypes'.
         */

        const adminUpdateData: any = {};
        if (adminName) adminUpdateData.name = adminName;
        if (adminEmail) adminUpdateData.email = adminEmail;
        if (adminPhone) adminUpdateData.phone = adminPhone;

        /**
         * Conditional Property Injection (Spread Operator):
         * The '...(condition && { key: value })' syntax ensures that the key is ONLY
         * added to the object if the condition is truthy. 
         * This prevents sending 'undefined' fields to Prisma.
         */
        const schoolUpadate = await prisma.school.update({
            where: {
                id: id
            },
            data: {
                ...(schoolName && { name: schoolName }),
                ...(schoolAdress && { address: schoolAdress }),

            // Only trigger a nested update if there is data to change for the admin
               ...(Object.keys(adminUpdateData).length > 0 && {
                    users: {
                        update: {
                            where: { id: admin.id },
                            data: adminUpdateData
                        }
                    }
                })
            }
        })

        return res.json({
            message: "Dados atulizados com sucesso",
            schoolUpadate
        })

    }catch(error: any){
        /**
         * Prisma Error Handling:
         * P2002 is the error code for "Unique constraint failed".
         */
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Este nome de escola ou email de administrador já está em uso." });
        }
        console.error(error);
        return res.status(500).json({error: "Error ao tentar actualizar as informações"});
    }
}
//Meu eu do futuro desculpa pelas gambiaras feitas no school update, 
// estava sobre efeito de stress, o cão chamado typescript estava 
// gritar mng porque não queria nenhum campo como undefined.



// TODO: Implementar lógica de Soft Delete (campo active: boolean)