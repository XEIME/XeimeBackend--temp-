import { Router } from "express";
import { createSchoolWithAdmin } from "../controllers/school.controller";
import { listSchools } from "../controllers/school.controller";
import { getSchoolsDetalhes } from "../controllers/school.controller";
import { schoolupdate } from "../controllers/school.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";



const router = Router();

/**
 * @openapi
 * /schools:
 *   post: 
 *     summary: Criar nova escola e seu administrador
 *     description: Resgita uma instituição e cria automaticamente o utilizador com perfil SCHOOL_ADMIN.
 *     tags: [Administração Central]
 *     security:
 *       - bearerAuth: []
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object 
 *             required: [schoolName, adminEmail, adminPassword]
 *             properties:
 *               schoolName: 
 *                 type: string 
 *                 example: "Escola primária Carlos Filipe Tembe"
 *               schoolAdress: 
 *                 type: string
 *                 example: "Matola, Machava Bunhiça"
 *               adminName: 
 *                 type: string
 *                 example: "Carlos Tembe Admin"
 *               adminEmail: 
 *                 type: string
 *                 example: "carlostembe.Admin@xeime.com"
 *               adminPhone: 
 *                 type: string
 *                 example: "841234567"
 *               adminPassword: 
 *                 type: string
 *                 example: "123456"
 *     responses: 
 *       201: 
 *        description: Escola e Administrador criados com sucesso!
 *       500: 
 *        description: Erro ao criar escolas ou o nome já existe.
 */
router.post("/", authMiddleware, checkRole([Role.SUPER_ADMIN]),  createSchoolWithAdmin);

/**
 * @openapi
 * /schools:
 *   get: 
 *     summary: Listar todas as escolas
 *     tags: [Administração Central]
 *     security:
 *       - bearerAuth: []
 * 
 *     responses: 
 *       200: 
 *        description: Lista exibida com sucesso.
 */
router.get("/", authMiddleware, checkRole([Role.SUPER_ADMIN]), listSchools);

/**
 * @openapi
 * /schools/{id}:
 *   get: 
 *     summary: Obter detalhes de uma escola específica
 *     description: Retorna os dados da escola e as informações do seu administrador principal.
 *     tags: [Administração Central]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *         description: ID único da escola (UUID).
 *     responses: 
 *       200: 
 *        description: Detalhes da escola carregados
 *       400: 
 *        description: ID da escola é obrigatório.
 *       404: 
 *         description: Escola não encontrada.
 */
router.get("/:id", authMiddleware, checkRole([Role.SUPER_ADMIN]),  getSchoolsDetalhes);

/**
 * @openapi
 * /schools/{id}:
 *   patch: 
 *     summary: Atualizar dados da escola e admin.
 *     tags: [Administração Central]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *     requestBody: 
 *       content: 
 *         application/json: 
 *           schema: 
 *             type: object
 *             properties: 
 *               schoolName: 
 *                 type: string
 *               schoolAdress: 
 *                 type: string
 *               adminName: 
 *                 type: string
 *               adminEmail: 
 *                 type: string
 *               adminPhone: 
 *                 type: string
 *     responses: 
 *       200: 
 *        description: Dados atulizados com sucesso
 */
router.patch("/:id", authMiddleware, checkRole([Role.SUPER_ADMIN]), schoolupdate);

export default router;