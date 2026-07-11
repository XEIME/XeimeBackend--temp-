import { z } from 'zod';

export const createHomeworkSchema = z.object({
  body: z.object({
    classId: z.string().uuid('ID da turma inválido'),
    subjectId: z.string().uuid('ID da disciplina inválido'),
    title: z.string().min(3, 'O título do TPC deve ter no mínimo 3 caracteres'),
    description: z.string().min(1, 'A descrição do TPC é obrigatória'),
    dueData: z.string().datetime('Formato de data de entrega inválido'),
  }),
});

export const updateHomeworkSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    dueData: z.string().datetime().optional(),
  }),
});