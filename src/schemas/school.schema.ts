import { z } from 'zod';

// verify format phone number, +258, 258, | 83, 82, 84, 85, 86, 87
const mozPhoneRegex = /^(?:\+258|258)?(8[2-7])\d{7}$/;

export const createSchoolSchema = z.object({
  body: z.object({
    //school data
    schoolName: z
      .string()
      .min(5, 'O nome da escola deve ter pelo menos 5 caracteres'),
    schoolAdress: z.string().min(5, 'O endereço deve ser mais detalhado'),
    //admin data
    adminName: z.string().min(3, 'O nome do administrador é obrigatório'),
    adminEmail: z
      .string()
      .email('Introduza um email válido para o administrador'),
    adminPhone: z
      .string()
      .regex(mozPhoneRegex, 'Telefone do administrador inválido'),
    adminPassword: z
      .string()
      .min(6, 'A password deve ter pelo menos 6 caracteres'),
  }),
});

//schema to validate the update data
export const updateSchoolSchema = z.object({
  params: z.object({
    id: z.string().uuid('O ID inválido'),
  }),
  body: z.object({
    schoolName: z.string().min(5).optional(),
    schoolAdress: z.string().min(5).optional(),
    adminName: z.string().min(3).optional(),
    adminEmail: z.string().email().optional(),
    adminPhone: z.string().regex(mozPhoneRegex).optional(),
  }),
});

//schema to validate the param id
export const getSchoolSchema = z.object({
  params: z.object({
    id: z.string().uuid('O ID da escola deve ser um UUID válido.'),
  }),
});

export type CreateSchoolInput = z.infer<typeof createSchoolSchema>['body'];
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>['body'];
