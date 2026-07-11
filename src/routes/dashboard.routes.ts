import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { getSuperAdminDashboard } from "../controllers/dashboard.controller";
import { getSchoolAdminDashboard } from "../controllers/dashboard.controller";
import { getTeacherDashboard } from "../controllers/dashboard.controller";

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

/**
 * @openapi
 * /dashboard/school_admin:
 *   get: 
 *     summary: dachbord do school admin
 *     description: info do school admin
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
router.get("/school_admin", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), getSchoolAdminDashboard);


/**
 * @openapi
 * /dashboard/teacher:
 *   get: 
 *     summary: dashbord do professor
 *     description: info do professor
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

router.get("/teacher", authMiddleware, checkRole([Role.TEACHER]), getTeacherDashboard);


export default router;