import { Router } from "express";
import { generetClass } from "../controllers/class.controller";
import { getClasses } from "../controllers/class.controller";
import { updateClass } from "../controllers/class.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../middlewares/validate";
import { createClassSchema, updateClassSchema } from "../schemas/class.schema";

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
router.post("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), validate(createClassSchema), generetClass);

/**
 * @openapi
 * /class:
 *   get: 
 *     summary: Listar todas as Turmas da escola e o numero de alunos por turma
 *     description: Retorna todas as Turmas registadas na instituição do utilizador, com o numero de alunos por turma.
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
router.get("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), getClasses);


 /**
 * @openapi
 * /class/{id}:
 *   patch: 
 *     summary: Atualizar dados de uma turma
 *     tags: [Gestão Académica]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             properties:
 *               name: 
 *                 type: string 
 *                 example: "Turma B"
 *               gradeId: 
 *                 type: string 
 *                 format: uuid
 */
router.patch("/:id", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), validate(updateClassSchema), updateClass);

export default router;


