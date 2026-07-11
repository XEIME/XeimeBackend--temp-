import { Router } from 'express';
import { Role } from '../../generated/prisma/enums';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import * as controller from '../controllers/teacherClassProgress.controller';
import { validate } from '../middlewares/validate';
import { queryProgressSchema, completeTopicSchema } from '../schemas/teacherClassProgress.schema';

const router = Router();

/**
 * @openapi
 * /teacher/progress/summary:
 *   get:
 *     summary: Obtém o resumo numérico e percentual do progresso de uma turma
 *     tags: [Teacher Class Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resumo do progresso obtido com sucesso.
 *       400:
 *         description: Parâmetros inválidos.
 *       404:
 *         description: Plano analítico não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/teacher/progress/summary', authMiddleware, (checkRole([Role.TEACHER])), validate(queryProgressSchema), controller.getClassProgressSummary);

/**
 * @openapi
 * /teacher/progress/topics:
 *   get:
 *     summary: Lista todos os tópicos do plano indicando quais já foram concluídos
 *     tags: [Teacher Class Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de tópicos retornada com sucesso.
 *       400:
 *         description: Parâmetros inválidos.
 *       404:
 *         description: Plano analítico não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/teacher/progress/topics', authMiddleware, (checkRole([Role.TEACHER])), validate(queryProgressSchema), controller.getClassProgressTopics);

/**
 * @openapi
 * /teacher/progress/topics/{topicId}/complete:
 *   post:
 *     summary: Marca um tópico do plano analítico como executado/concluído para uma turma
 *     tags: [Teacher Class Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
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
 *               - classId
 *             properties:
 *               classId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Tópico marcado como concluído com sucesso.
 *       400:
 *         description: Tópico já se encontra validado ou requisição inválida.
 *       404:
 *         description: Tópico não localizado.
 */
router.post('/teacher/progress/topics/:topicId/complete', authMiddleware, (checkRole([Role.TEACHER])), validate(completeTopicSchema), controller.completeTopic);

export default router;