import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { countSchoolAdmins } from "../controllers/admin.controller";


const router = Router();

/**
 * @openapi
 * /admins/count:
 *   get: 
 *     summary: Mostrar o numero de adminstradores
 *     description: Retorna o numero total de todos adminstradores.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses: 
 *       200: 
 *        description: numero exibido com com sucesso.
 *       500: 
 *        description: Erro interno no servidor.
 */

router.get("/count", authMiddleware, checkRole([Role.SUPER_ADMIN]), countSchoolAdmins);

export default router;