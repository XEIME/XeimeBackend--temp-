import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import { LoginInput } from "../schemas/auth.schema.js";

export const login = async (req: Request, res: Response) => {

    //using the type of the schema (auth.schema.ts)
    const {login, password} = req.body as LoginInput;
    
    try {
       const user = await prisma.user.findFirst({
        where: {
            OR: [
                {email: login},
                {phone: login},
            ]   
        }
       })
        
        if(!user) {
            return res.status(401).json({error: "Credenciais inválidas"});
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({error: "Credenciais inválidas"})
        }

        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign(
            {id: user.id, role: user.role, schoolId: user.schoolId},
            secret,
            {expiresIn: '1d'}
        );

        return res.json({
            message: "Login realizado com sucesso",
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        });
    }catch (error: any){
        console.log("detalhes do erro no terminal: ", error)
        return res.status(500).json({error: error.message});
    }
};