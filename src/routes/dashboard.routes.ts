import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { getSuperAdminDashboard } from "../controllers/dashboard.controller";

const router = Router();

/**
 * @openapi
 * /dashboard/super_admin:
 *   get: 
 *     summary: Mostrar o numero total de utilizadores pra cada tipo de role
 *     description: Retorna o numero total de cada tipo de utilizador.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses: 
 *       200: 
 *        description: numero exibido com com sucesso.
 *       500: 
 *        description: Erro ao carregar os dados do dashboard.
 */

router.get("/super_admin", authMiddleware, checkRole([Role.SUPER_ADMIN]), getSuperAdminDashboard);

export default router;