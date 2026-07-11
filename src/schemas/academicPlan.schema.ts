import { z } from 'zod';

export const createAcademicPlanSchema = z.object({
  body: z.object({
    gradeId: z.string().uuid('ID da classe inválido'),
    subjectId: z.string().uuid('ID da disciplina inválido'),
    trimester: z.number().int().min(1).max(3),
    year: z.number().int().min(2026),
  }),
});

export const createTopicSchema = z.object({
  body: z.object({
    weekNumber: z.number().int().min(1).max(20),
    unit: z.string().min(2, 'A unidade deve ter no mínimo 2 caracteres'),
    content: z.array(z.string()).min(1, 'Deve incluir pelo menos um conteúdo'),
    objectives: z.array(z.string()).min(1, 'Deve incluir pelo menos um objetivo'),
    numberOfLessons: z.number().int().positive(),
  }),
});

export const updateAcademicPlanSchema = z.object({
  body: z.object({
    trimester: z.number().int().min(1).max(3).optional(),
    year: z.number().int().min(2026).optional(),
  }),
});

export const updateTopicSchema = z.object({
  body: z.object({
    weekNumber: z.number().int().min(1).max(20).optional(),
    unit: z.string().min(2).optional(),
    content: z.array(z.string()).optional(),
    objectives: z.array(z.string()).optional(),
    numberOfLessons: z.number().int().positive().optional(),
  }),
});