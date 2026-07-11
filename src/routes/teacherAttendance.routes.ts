import { Router } from 'express';
import { Role } from '../../generated/prisma/enums';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import * as controller from '../controllers/teacherAttendance.controller';
import { validate } from '../middlewares/validate';
import * as schema from '../schemas/teacherAttendance.schema';

const router = Router();

/**
 * @openapi
 * /teacher/attendances:
 *   post:
 *     summary: Regista ou atualiza uma folha de presenças em modo rascunho
 *     tags: [Teacher Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classid
 *               - subjectId
 *               - records
 *             properties:
 *               classid:
 *                 type: string
 *                 format: uuid
 *               subjectId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date-time
 *               records:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - studentId
 *                     - status
 *                   properties:
 *                     studentId:
 *                       type: string
 *                       format: uuid
 *                     status:
 *                       type: string
 *                       enum:
 *                         - PRESENTE
 *                         - FALTA
 *                         - ATRASO
 *                     note:
 *                       type: string
 *     responses:
 *       201:
 *         description: Presenças registadas com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno do servidor.
 *
 *   get:
 *     summary: Lista as presenças de uma turma numa determinada data
 *     tags: [Teacher Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classid
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
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Lista de presenças carregada com sucesso.
 *       400:
 *         description: Parâmetros inválidos.
 *       404:
 *         description: Nenhuma presença encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/teacher/attendances', authMiddleware, (checkRole([Role.TEACHER])), validate(schema.createAttendanceSchema), controller.createAttendance);
router.get('/teacher/attendances', authMiddleware, (checkRole([Role.TEACHER])), controller.getAttendances);

/**
 * @openapi
 * /teacher/attendances/{id}:
 *   patch:
 *     summary: Atualiza o estado de presença de um estudante
 *     tags: [Teacher Attendance]
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
 *               status:
 *                 type: string
 *                 enum:
 *                   - PRESENTE
 *                   - FALTA
 *                   - ATRASO
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Presença atualizada com sucesso.
 *       404:
 *         description: Registo de presença não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.patch('/teacher/attendances/:id', authMiddleware, (checkRole([Role.TEACHER])), validate(schema.updateAttendanceSchema), controller.updateAttendance);

/**
 * @openapi
 * /teacher/attendances/publish:
 *   post:
 *     summary: Publica oficialmente a folha de presenças para consulta dos encarregados
 *     tags: [Teacher Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classid
 *               - subjectId
 *               - date
 *             properties:
 *               classid:
 *                 type: string
 *                 format: uuid
 *               subjectId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Folha de presenças publicada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Nenhuma presença encontrada para publicação.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/teacher/attendances/publish', authMiddleware, (checkRole([Role.TEACHER])), validate(schema.publishAttendanceSchema), controller.publishAttendance);

export default router;