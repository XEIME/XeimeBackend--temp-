import { Router } from "express";
import { generetClass } from "../controllers/class.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

/**
 * @openapi
 * /class:
 *   post: 
 *     summary: Criar uma nova turma
 *     description: Regista uma turma vinculada a uma classe específica da instituição. Apenas para Administradores de Escola.
 *     tags: [Gestão Académica]
 *     security:
 *       - bearerAuth: []
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             required: 
 *               - name
 *               - gradeId
 *             properties:
 *               name: 
 *                 type: string 
 *                 description: O nome da turma.
 *                 example: "Turma B"
 *               gradeId: 
 *                 type: string 
 *                 description: O ID da classe (Grade) á qual esta turma pertence
 *                 example: "uuid-da-classe-aqui"
 *     responses: 
 *       201: 
 *        description: A turma foi criada com sucesso.
 *       400: 
 *        description: O nome da turma e a classe são obrigatórios.
 *       403: 
 *         description: Acesso negado. O seu utilizador não está vinculado a nenhuma escola
 *       404: 
 *         description: A classe selecionada não foi encontrada ou não pertence a esta instituição.
 *       409: 
 *         description: Já existe uma turma com esse nome registada nessa classe.
 *       500: 
 *        description: Erro interno no servidor.
 * 
 */
router.post("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), generetClass)

export default router;


