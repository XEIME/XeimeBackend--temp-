/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticar um utilizador
 *     description: Permite entrar no sistema usando Email ou Telefone. Retorna um Token JWT.
 *     tags: [Autenticação]
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             required: 
 *               - login
 *               - password
 *             properties:
 *               login: 
 *                 type: string 
 *                 description: Email ou Número de Telefone do utilizador.
 *                 example: "admin@escola.ac.mz"
 *               password: 
 *                 type: string 
 *                 format: password
 *                 example: "123456"
 *     responses: 
 *       200: 
 *        description: Login realizado com sucesso.
 *       401: 
 *        description: Credenciais inválidas.
 *       500: 
 *        description: Erro interno no servidor.
 */

import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.post('/login', login)

// router.get('/me', authMiddleware, (req, res) => {
//     return res.json({message: "Tu estás autenticado",
//         user: req.user
//     })
// });

export default router;
