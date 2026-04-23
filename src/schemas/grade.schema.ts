import {z} from "zod"

export const generateGradesSchema = z.object({
    body: z.object({
        start: z.number().int().min(1, 'O início deve ser pelo menos 1'),
        end: z.number().max(6, 'O limite do sistema é a 6ª classe'),
    }).refine((data) => data.start <= data.end, {
        message: "O início do intervalo não pode ser maior que o fim.",
        path: ["start"],
    }),
});

export type GenerateGradesInput = z.infer<typeof generateGradesSchema>['body'];