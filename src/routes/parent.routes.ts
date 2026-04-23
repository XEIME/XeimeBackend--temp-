import { Router } from "express";
import { getParents } from "../controllers/parent.controller";
import { getParentsDetalhes } from "../controllers/parent.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../middlewares/validate";
import { getParentSchema } from "../schemas/parent.schema";

const router = Router();

/**
 * @openapi
 * /parents:
 *   get: 
 *     summary: Listar encarregado dos alunos da escola
 *     description: Retorna todos os encarregados vinculados à instituição do administrador logado.
 *     tags: [Encarregados]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses: 
 *       200: 
 *        description: Lista de encarregados carregada.
 */
router.get("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), getParents);


/**
 * @openapi
 * /parents/{id}:
 *   get: 
 *     summary: Ver detalhes do encarregado
 *     tags: [Encarregados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *         description: ID único do encarregado (UUID).
 *     responses: 
 *       200: 
 *        description: Detalhes do encarregado.
 *       404: 
 *         description: Encarregado não encontrado.
 */
router.get("/:id", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), validate(getParentSchema), getParentsDetalhes);

export default router;