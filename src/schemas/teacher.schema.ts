import {z} from "zod";

// verify format phone number, +258, 258, | 83, 82, 84, 85, 86, 87
const mozPhoneRegex = /^(?:\+258|258)?(8[2-7])\d{7}$/;

export const createTeacherSchema = z.object({
    body: z.object({
    teacherName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    teacherEmail: z.string().email('Introduza um email válido para o Professor'),
    teacherPhone: z.string().regex(mozPhoneRegex, 'Telefone do professor inválido'),
    teacherPassword: z.string().min(6, 'A password deve ter pelo menos 6 caracteres'),
    teacherClass: z.string().uuid('ID da turma inválido'),
    teacherGrade: z.string().uuid('ID da classe (grade) inválido'),
  }),
});

export const updateTeacherSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID do professor inválido'),
  }),
  body: z.object({
    teacherName: z.string().min(3).optional(),
    teacherEmail: z.string().email().optional(),
    teacherPhone: z.string().regex(mozPhoneRegex).optional(),
    teacherClass: z.string().uuid().optional(),
    teacherGrade: z.string().uuid().optional(),
  }),
});

export const getTeacherSchema = z.object({
  params: z.object({
    id: z.string().uuid('O ID do professor deve ser um UUID válido.'),
  }),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>['body'];
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>['body'];