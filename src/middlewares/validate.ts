import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType}from "zod";

export const validate = (schema: ZodType <any, any, any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            //verify if the body
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            //call the next step
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                // stop if they is are erro
                return res.status(400).json({
                    error: "Erro de validação de campos",
                    details: error.issues.map((issue) =>({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }
            return res.status(500).json({error: "Erro interno no processo de validação"});
        }
    }