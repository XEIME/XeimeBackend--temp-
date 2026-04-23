import { Router } from "express";
import { getGrades } from "../controllers/grade.controller";
import { generateGrades } from "../controllers/grade.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../middlewares/validate";
import { generateGradesSchema } from "../schemas/grade.schema";

const router = Router();

/**
 * @openapi
 * /grades:
 *   post: 
 *     summary: Gerar intervalo de classes (Grade)
 *     description: Cria automaticamente um intervalo de classes para a escola do utilizador.
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
 *               - start
 *               - end
 *             properties:
 *               start: 
 *                 type: integer 
 *                 example: 1
 *               end: 
 *                 type: integer
 *                 example: 6
 *     responses: 
 *       201: 
 *        description: Classes configuradas com sucesso.
 *       400: 
 *        description: Intervalo inválido ou dados em falta.
 *       403: 
 *        description: Acesso negado. O seu utilizador não está vinculado a nenhuma escola
 *       500: 
 *        description: Erro interno no servidor.
 */
router.post("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), validate(generateGradesSchema), generateGrades);

/**
 * @openapi
 * /grades:
 *   get: 
 *     summary: Listar todas as classes da escola
 *     description: Retorna todas as classes registadas na instituição do utilizador, com a contagem de turmas.
 *     tags: [Gestão Académica]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses: 
 *       200: 
 *        description: Lista exibida com sucesso.
 *       500: 
 *        description: Erro interno no servidor.
 */
router.get("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), getGrades);

export default router;