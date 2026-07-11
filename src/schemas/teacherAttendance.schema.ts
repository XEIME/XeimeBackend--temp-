import { z } from "zod";
import { AttendenceStatus } from "../../generated/prisma/enums";

export const createAttendanceSchema = z.object({
  body: z.object({
    classid: z.string().uuid("ID da turma inválido"),
    subjectId: z.string().uuid("ID da disciplina inválido"),
    date: z.string().datetime().optional(),

    records: z
      .array(
        z.object({
          studentId: z.string().uuid("ID do estudante inválido"),

          status: z.nativeEnum(AttendenceStatus),

          note: z.string().optional(),
        })
      )
      .min(1, "A chamada deve conter pelo menos um aluno"),
  }),
});

export const updateAttendanceSchema = z.object({
  body: z.object({
    status: z.nativeEnum(AttendenceStatus),

    note: z.string().optional(),
  }),
});

export const publishAttendanceSchema = z.object({
  body: z.object({
    classid: z.string().uuid("ID da turma inválido"),
    subjectId: z.string().uuid("ID da disciplina inválido"),
    date: z.string().datetime("Formato de data inválido"),
  }),
});