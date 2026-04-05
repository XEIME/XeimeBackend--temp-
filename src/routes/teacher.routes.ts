import { Router } from "express";
import { createTeacher } from "../controllers/teacher.controller";
import { listTeachers } from "../controllers/teacher.controller";
import { getTeacherDetalhes } from "../controllers/teacher.controller";
import { updateTeacher } from "../controllers/teacher.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";


const router = Router();

/**
 * @openapi
 * /teachers:
 *   post: 
 *     summary: Cadastrar um novo professor
 *     description: Regista um professor e vincula-o como regente de uma turma específica.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             required: [teacherName, teacherEmail, teacherPassword, teacherClass, teacherGrade]
 *             properties:
 *               teacherName: 
 *                 type: string 
 *                 example: "João Batista"
 *               teacherEmail: 
 *                 type: string
 *                 example: "joãoBatista.teacher@escola.com"
 *               teacherPhone: 
 *                 type: string
 *                 example: "870000000"
 *               teacherPassword: 
 *                 type: string
 *                 example: "prof123"
 *               teacherClass: 
 *                 type: string 
 *                 description: ID da Turma (schoolClass).
 *                 example: "id-da-turma-aqui"
 *               teacherGrade: 
 *                 type: string
 *                 description: ID da Classe (schoolGrade).
 *                 example: "id-da-classe-aqui"
 *     responses: 
 *       201: 
 *        description: O professor foi criado com sucesso.
 *       400: 
 *        description: Email/Telefone em uso ou turma inválida.
 *       403:
 *        description: Acesso negado. O seu utilizador não está vinculado a nenhuma escola.
 *       409: 
 *        description: Esta turma já tem um professor regente atribuído. Remova o professor atual antes de atribuir um novo
 *       500: 
 *        description: Erro ao processar cadastro. 
 */
router.post("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), createTeacher);

/**
 * @openapi
 * /teachers:
 *   get: 
 *     summary: Listar professores da escola
 *     description: Retorna todos os professores vinculados à instituição do administrador logado.
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses: 
 *       200: 
 *        description: Lista de professores carregada
 */
router.get("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), listTeachers);

/**
 * @openapi
 * /teachers/{id}:
 *   get: 
 *     summary: Ver detalhes do professor
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *         description: ID único do professor (UUID).
 *     responses: 
 *       200: 
 *        description: Detalhes do professor e sua turma.
 *       404: 
 *         description: Professor não encontrado.
 */
router.get("/:id", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), getTeacherDetalhes);

/**
 * @openapi
 * /teachers/{id}:
 *   patch: 
 *     summary: Atualizar dados do professor
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: object
 *         properties: 
 *               teacherName: 
 *                 type: string
 *               teacherEmail: 
 *                 type: string
 *               teacherPhone: 
 *                 type: string
 *               teacherClass: 
 *                 type: string
 *               teacherGrade: 
 *                 type: string
 *     responses: 
 *       200: 
 *        description: Detalhes do professor e sua turma.
 */
router.patch("/:id", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), updateTeacher)

export default router;