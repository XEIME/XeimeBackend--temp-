import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { getTeacherStudents } from "../controllers/teacherStudents.controller";

const router = Router();

/**
 * @openapi
 * /teacher/students:
 *   get:
 *     summary: Lista os alunos da turma do professor autenticado
 *     tags: [Teacher Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alunos carregada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     class:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                         grade:
 *                           type: string
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Professor sem turma atribuída.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get(
  "/teacher/students",
  authMiddleware,
  checkRole([Role.TEACHER]),
  getTeacherStudents,
);

export default router;