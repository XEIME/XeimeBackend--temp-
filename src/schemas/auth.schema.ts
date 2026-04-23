import { z } from 'zod';

// verify format phone number, +258, 258, | 83, 82, 84, 85, 86, 87
const mozPhoneRegex = /^(?:\+258|258)?(8[2-7])\d{7}$/;

export const loginSchema = z.object({
  body: z
    .object({
      login: z.string().min(1, 'O campo de login é obrigatório'),
      password: z
        .string()
        .min(4, 'A password deve ter pelo menos 4 caracteres'),
    })
    .refine(
      (data) => {
        const isEmail = z.string().email().safeParse(data.login).success;
        const isPhone = mozPhoneRegex.test(data.login);
        const isUsername = /^[a-zA-Z][a-zA-Z0-9._]{2,}$/.test(data.login);

        // making sure that the login is one of this types
        if (!(isEmail || isPhone || isUsername)) return false;

        return true;
      },
      {
        message: 'Introduza um email, telefone moçambicano ou username válido',
        path: ['login'],
      },
    )
    .refine(
      (data) => {
        const isEmail = z.string().email().safeParse(data.login).success;
        const isPhone = mozPhoneRegex.test(data.login);

        // 2. REGRA DE OURO: Se for Email ou Telefone (Admin/Pai), exige 6 caracteres
        if ((isEmail || isPhone) && data.password.length < 6) {
          return false;
        }

        // Se for Aluno (username), o .min(4) do objeto principal já validou
        return true;
      },
      {
        message:
          'Para este tipo de conta, a password deve ter pelo menos 6 caracteres',
        path: ['password'],
      },
    ),
});

//exporting the type so a can use it on the controller
export type LoginInput = z.infer<typeof loginSchema>["body"];
