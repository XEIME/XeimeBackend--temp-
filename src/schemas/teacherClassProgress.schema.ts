import { z } from 'zod';

export const completeTopicSchema = z.object({
  params: z.object({
    topicId: z.string().uuid('ID do tópico inválido'),
  }),
  body: z.object({
    classId: z.string().uuid('ID da turma inválido'),
  }),
});

export const queryProgressSchema = z.object({
  query: z.object({
    classId: z.string().uuid('ID da turma inválido'),
    subjectId: z.string().uuid('ID da disciplina inválido'),
  }),
});