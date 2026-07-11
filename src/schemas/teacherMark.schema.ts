import { z } from "zod";
import { MarkType } from "../../generated/prisma/enums";

export const launchMarkSchema = z.object({
  body: z.object({
    studentId: z.string().uuid("ID do estudante inválido"),

    subjectId: z.string().uuid("ID da disciplina inválido"),

    trimester: z.number().int().min(1).max(3),

    type: z.nativeEnum(MarkType),

    value: z
      .number()
      .min(0, "A nota mínima é 0")
      .max(20, "A nota máxima é 20"),

    year: z.number().int().min(2026),
  }),
});

export const updateMarkSchema = z.object({
  body: z.object({
    value: z
      .number()
      .min(0, "A nota mínima é 0")
      .max(20, "A nota máxima é 20"),
  }),
});