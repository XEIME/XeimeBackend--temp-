import { Router } from 'express';
import { Role } from '../../generated/prisma/enums';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import * as controller from '../controllers/teacherMark.controller';
import { validate } from '../middlewares/validate';
import * as schema from '../schemas/teacherMark.schema';

const router = Router();

/**
 * @openapi
 * /teacher/marks:
 *   post:
 *     summary: Lança uma nota para um estudante
 *     tags: [Teacher Marks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - subjectId
 *               - trimester
 *               - type
 *               - value
 *               - year
 *             properties:
 *               studentId:
 *                 type: string
 *                 format: uuid
 *               subjectId:
 *                 type: string
 *                 format: uuid
 *               trimester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum:
 *                   - AC1
 *                   - AC2
 *                   - AC3
 *                   - AT
 *               value:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 20
 *                 example: 17
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Nota lançada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       403:
 *         description: Acesso negado.
 *       409:
 *         description: Já existe uma nota deste tipo para o estudante.
 *       500:
 *         description: Erro interno do servidor.
 *
 *   get:
 *     summary: Lista todas as notas lançadas pelo professor
 *     tags: [Teacher Marks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: trimester
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de notas carregada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/teacher/marks', authMiddleware, (checkRole([Role.TEACHER])), validate(schema.launchMarkSchema), controller.launchMark);
router.get('/teacher/marks', authMiddleware, (checkRole([Role.TEACHER])), controller.getMarks);


/**
 * @openapi
 * /teacher/marks/{id}:
 *   get:
 *     summary: Obtém os detalhes de uma nota
 *     tags: [Teacher Marks]
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
 *         description: Detalhes da nota obtidos com sucesso.
 *       404:
 *         description: Nota não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 *
 *   patch:
 *     summary: Atualiza o valor de uma nota existente
 *     tags: [Teacher Marks]
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
 *               - value
 *             properties:
 *               value:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 20
 *                 example: 18
 *     responses:
 *       200:
 *         description: Nota atualizada com sucesso.
 *       400:
 *         description: Valor inválido.
 *       404:
 *         description: Nota não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 *
 *   delete:
 *     summary: Remove uma nota do sistema
 *     tags: [Teacher Marks]
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
 *         description: Nota removida com sucesso.
 *       404:
 *         description: Nota não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch('/teacher/marks/:id', authMiddleware, (checkRole([Role.TEACHER])), validate(schema.updateMarkSchema), controller.updateMark);

export default router;