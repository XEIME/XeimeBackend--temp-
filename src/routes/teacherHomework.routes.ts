import { Router } from 'express';
import { Role } from '../../generated/prisma/enums';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import * as controller from '../controllers/teacherHomework.controller';
import { validate } from '../middlewares/validate';
import * as schema from '../schemas/teacherHomework.schema';

const router = Router();

/**
 * @openapi
 * /teacher/homeworks:
 *   post:
 *     summary: Cria um novo Trabalho Para Casa (TPC)
 *     tags: [Teacher Homework]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - subjectId
 *               - title
 *               - description
 *               - dueData
 *             properties:
 *               classId:
 *                 type: string
 *                 format: uuid
 *               subjectId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *                 example: "TPC - Matemática"
 *               description:
 *                 type: string
 *                 example: "Resolver os exercícios da página 15."
 *               dueData:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: TPC criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno do servidor.
 *
 *   get:
 *     summary: Lista todos os Trabalhos Para Casa da escola do professor
 *     tags: [Teacher Homework]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de TPCs carregada com sucesso.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/teacher/homeworks', authMiddleware, (checkRole([Role.TEACHER])), validate(schema.createHomeworkSchema), controller.createHomework);
router.get('/teacher/homeworks', authMiddleware, (checkRole([Role.TEACHER])), controller.getHomeworks);

/**
 * @openapi
 * /teacher/homeworks/{id}:
 *   get:
 *     summary: Obtém os detalhes de um Trabalho Para Casa
 *     tags: [Teacher Homework]
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
 *         description: Detalhes do TPC carregados com sucesso.
 *       404:
 *         description: TPC não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 *
 *   patch:
 *     summary: Atualiza um Trabalho Para Casa existente
 *     tags: [Teacher Homework]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueData:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: TPC atualizado com sucesso.
 *       404:
 *         description: TPC não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 *
 *   delete:
 *     summary: Remove um Trabalho Para Casa
 *     tags: [Teacher Homework]
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
 *         description: TPC removido com sucesso.
 *       404:
 *         description: TPC não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch('/teacher/homeworks/:id', authMiddleware, (checkRole([Role.TEACHER])), validate(schema.updateHomeworkSchema), controller.updateHomework);
router.delete('/teacher/homeworks/:id', authMiddleware, (checkRole([Role.TEACHER])), controller.deleteHomework);

export default router;