import {z} from "zod"

// verify format phone number, +258, 258, | 83, 82, 84, 85, 86, 87
const mozPhoneRegex = /^(?:\+258|258)?(8[2-7])\d{7}$/;

export const createStudentAndParentSchema = z.object({
  body: z.object({
    // Student Data
    studentUsername: z.string().min(3, 'Username do aluno deve ter pelo menos 3 caracteres'),
    studentPin: z.string().min(4, 'O PIN deve ter pelo menos 4 dígitos'),
    studentName: z.string().min(3, 'Nome do aluno é obrigatório'),
    studentClass: z.string().uuid('ID da turma inválido'),
    
    // Parent Data
    parentName: z.string().min(3, 'Nome do encarregado é obrigatório'),
    parentEmail: z.string().email('Email do encarregado inválido').optional().or(z.literal('')),
    parentPhone: z.string().regex(mozPhoneRegex, 'Telefone moçambicano inválido'),
    parentPassword: z.string().min(6, 'A password do encarregado deve ter pelo menos 6 caracteres'),
  }),
});

export const updateStudentAndParentSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID do estudante inválido'),
  }),
  body: z.object({
    // Opctionl fields for update
    studentUsername: z.string().min(3).optional(),
    studentName: z.string().min(3).optional(),
    studentClass: z.string().uuid().optional(),
    
    parentName: z.string().min(3).optional(),
    parentEmail: z.string().email().optional(),
    parentPhone: z.string().regex(mozPhoneRegex).optional(),
  }),
});

export type CreateStudentAndParentInput = z.infer<typeof createStudentAndParentSchema>['body'];
export type UpdateStudentAndParentInput = z.infer<typeof updateStudentAndParentSchema>['body'];