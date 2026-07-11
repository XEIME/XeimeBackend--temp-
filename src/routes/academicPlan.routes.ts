import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { validate } from '../middlewares/validate';
import * as controller from '../controllers/academicPlan.controller';
import * as schema from '../schemas/academicPlan.schema';

const router = Router();

/**
 * @openapi
 * /academic-plans:
 *   post:
 *     summary: Cria um novo plano analítico
 *     tags: [Academic Plan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gradeId
 *               - subjectId
 *               - trimester
 *               - year
 *             properties:
 *               gradeId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               subjectId:
 *                 type: string
 *                 format: uuid
 *                 example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
 *               trimester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *                 example: 1
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Plano analítico criado com sucesso.
 *       400:
 *         description: Dados inválidos ou plano já existente.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno no servidor.
 *
 *   get:
 *     summary: Lista todos os planos analíticos da escola
 *     tags: [Academic Plan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planos carregada com sucesso.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post('/academic-plans',authMiddleware, checkRole([Role.SCHOOL_ADMIN, Role.SUPER_ADMIN]), validate(schema.createAcademicPlanSchema), controller.createAcademicPlan);
router.get('/academic-plans', authMiddleware, checkRole([Role.SCHOOL_ADMIN, Role.TEACHER]), controller.getAcademicPlans);

/**
 * @openapi
 * /academic-plans/{id}:
 *   get:
 *     summary: Obtém um plano analítico específico juntamente com os seus tópicos
 *     tags: [Academic Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Plano encontrado.
 *       404:
 *         description: Plano não encontrado.
 *
 *   patch:
 *     summary: Atualiza as informações básicas de um plano analítico
 *     tags: [Academic Plan]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trimester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *                 example: 2
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       200:
 *         description: Plano atualizado com sucesso.
 *       404:
 *         description: Plano não encontrado.
 */
router.get('/academic-plans/:id', authMiddleware, checkRole([Role.SCHOOL_ADMIN, Role.TEACHER]), controller.getAcademicPlanById);
router.patch('/academic-plans/:id', authMiddleware, checkRole([Role.SCHOOL_ADMIN]), validate(schema.updateAcademicPlanSchema), controller.updateAcademicPlan);

/**
 * @openapi
 * /academic-plans/{id}/topics:
 *   post:
 *     summary: Adiciona um novo tópico ao plano analítico
 *     tags: [Academic Plan]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weekNumber
 *               - unit
 *               - content
 *               - objectives
 *               - numberOfLessons
 *             properties:
 *               weekNumber:
 *                 type: integer
 *                 example: 1
 *               unit:
 *                 type: string
 *                 example: "Unidade I"
 *               content:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "Números Naturais"
 *                   - "Operações Básicas"
 *               objectives:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "Compreender os números naturais"
 *               numberOfLessons:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Tópico criado com sucesso.
 *       404:
 *         description: Plano não encontrado.
 *
 *   get:
 *     summary: Lista todos os tópicos pertencentes ao plano analítico
 *     tags: [Academic Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de tópicos carregada com sucesso.
 *       404:
 *         description: Plano não encontrado.
 */
router.post('/academic-plans/:id/topics', authMiddleware, checkRole([Role.SCHOOL_ADMIN]), validate(schema.createTopicSchema), controller.addTopic);
router.get('/academic-plans/:id/topics', authMiddleware, checkRole([Role.SCHOOL_ADMIN, Role.TEACHER]), controller.getTopicsByPlan);

/**
 * @openapi
 * /topics/{id}:
 *   patch:
 *     summary: Atualiza um tópico do plano analítico
 *     tags: [Academic Plan]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekNumber:
 *                 type: integer
 *               unit:
 *                 type: string
 *               content:
 *                 type: array
 *                 items:
 *                   type: string
 *               objectives:
 *                 type: array
 *                 items:
 *                   type: string
 *               numberOfLessons:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tópico atualizado com sucesso.
 *       404:
 *         description: Tópico não encontrado.
 *
 *   delete:
 *     summary: Remove um tópico do plano analítico
 *     tags: [Academic Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tópico removido com sucesso.
 *       404:
 *         description: Tópico não encontrado.
 */
router.patch('/topics/:id', authMiddleware, checkRole([Role.SCHOOL_ADMIN]), validate(schema.updateTopicSchema), controller.updateTopic);
router.delete('/topics/:id', authMiddleware, checkRole([Role.SCHOOL_ADMIN]), controller.deleteTopic);

export default router;