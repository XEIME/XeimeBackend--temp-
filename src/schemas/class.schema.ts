import { z } from 'zod';

export const createClassSchema = z.object({
    body: z.object({
    name: z.string().min(1, 'O nome da turma é obrigatório').max(20, 'Nome muito longo'),
    gradeId: z.string().uuid('ID da classe (Grade) inválido'),
  }),
});

export const updateClassSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID da turma inválido'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    gradeId: z.string().uuid().optional(),
  }),
});

export type CreateClassInput = z.infer<typeof createClassSchema>['body'];
export type UpdateClassInput = z.infer<typeof updateClassSchema>['body'];