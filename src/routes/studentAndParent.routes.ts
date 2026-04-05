import { Router } from "express";
import { creatStudentAndParent } from "../controllers/studentAndParent.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

/**
 * @openapi
 * /registration/students:
 *   post: 
 *     summary: Matricular Aluno e Encarregado
 *     description: Realiza o cadastro de um estudante e vincula-o a um encarregado (existente ou novo) dentro da mesma instituição.
 *     tags: [Matrículas]
 *     security:
 *       - bearerAuth: []
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             required: [studentUsername, studentPin, studentName, studentClass, parentName, parentPassword]
 *             properties:
 *               studentUsername: 
 *                 type: string 
 *                 description: Username ou email único para o login do aluno.
 *                 example: "Clayton2026"
 *               studentPin: 
 *                 type: string
 *                 description: Pin ou senha de acesso do aluno.
 *                 example: "1234"
 *               studentName: 
 *                 type: string
 *                 example: "Clayton Muangula"
 *               studentClass: 
 *                 type: string
 *                 description: ID da Turma (schoolClass) onde o aluno será matriculado.
 *                 example: "id-da-turma-aqui"
 *               parentName: 
 *                 type: string 
 *                 example: "Marcos Higildo"
 *               parentEmail: 
 *                 type: string
 *                 example: "marcos.parent@email.com"
 *               parentPhone: 
 *                 type: string
 *                 example: "840000000"
 *               parentPassword:
 *                  type: string
 *                  format: password 
 *                  example: "senha123"
 *     responses: 
 *       201: 
 *        description: Cadastro realizado com Sucesso!
 *       400: 
 *        description: Esse username já esta a ser usado por outro estudante
 *       403:
 *        description: Acesso negado. o seu utlizador não está vinculado a nenhuma escola.
 *       500: 
 *        description: Erro ao processar cadastro. 
 */
router.post("/students", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), creatStudentAndParent);

export default router;

