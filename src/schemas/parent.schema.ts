import {z} from "zod"

export const getParentSchema = z.object({
  params: z.object({
    id: z.string().uuid('O ID do encarregado deve ser um UUID válido.'),
  }),
});