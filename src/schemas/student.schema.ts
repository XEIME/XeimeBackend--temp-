import {z} from "zod"

export const getStudentSchema = z.object({
  params: z.object({
    id: z.string().uuid('O ID do aluno deve ser um UUID válido.'),
  }),
});
