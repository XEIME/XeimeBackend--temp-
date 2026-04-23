import { Router } from "express";
import { getStudents } from "../controllers/student.controller";
import { getStudentsDetalhes } from "../controllers/student.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../middlewares/validate"; 
import { getStudentSchema } from "../schemas/student.schema";

const router = Router();

/**
 * @openapi
 * /students:
 *   get: 
 *     summary: Listar alunos da escola
 *     description: Retorna todos os alunos vinculados à instituição do administrador logado.
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses: 
 *       200: 
 *        description: Lista de alunos carregada.
 */
router.get("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), getStudents);


/**
 * @openapi
 * /students/{id}:
 *   get: 
 *     summary: Ver detalhes do aluno
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *         description: ID único do aluno (UUID).
 *     responses: 
 *       200: 
 *        description: Detalhes do aluno.
 *       404: 
 *         description: Aluno não encontrado.
 */
router.get("/:id", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), validate(getStudentSchema), getStudentsDetalhes);

export default router;

