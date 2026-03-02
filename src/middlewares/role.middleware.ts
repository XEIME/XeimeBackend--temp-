import { Request, Response, NextFunction } from "express";
import { Role } from "../../generated/prisma/enums";

export const checkRole = (allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user) {
            return res.status(401).json({error: "Utilizador não autenticado."})
        }

        if(!allowedRoles.includes(req.user.role as Role)) {
            return res.status(403).json({
                error: "Acesso negado. Não tens permissão para aceder a este recurso."
            })
        }

        return next();
    };
}