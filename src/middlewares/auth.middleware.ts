import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

interface TokenPayload {
    id: string;
    role: string;
    schoolId: string | null;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({error: "Token não fornecido"});
    }

    const  parts = authHeader.split(" ");
    if(parts.length !== 2){
        return res.status(401).json({error: "Erro no formato do Token"});
    }

    const [,token] = parts;

    if(!token){
        return res.status(401).json({error: "Token malformado"})
    }

    try{
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as unknown as TokenPayload

        req.user = {
            id: decoded.id, 
            role: decoded.role,
            schoolId: decoded.schoolId
        };

        return next();
    } catch (error) {
        return res.status(401).json({error: "Token inválido ou expirado"})
    }
};