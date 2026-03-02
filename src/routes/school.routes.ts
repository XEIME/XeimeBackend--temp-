import { Router } from "express";
import { createSchoolWithAdmin } from "../controllers/school.controller";
import { listSchools } from "../controllers/school.controller";
import { getSchoolsDetalhes } from "../controllers/school.controller";
import { schoolupdate } from "../controllers/school.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";



const router = Router();

router.post("/", authMiddleware, checkRole([Role.SUPER_ADMIN]),  createSchoolWithAdmin);
router.get("/", authMiddleware, checkRole([Role.SUPER_ADMIN]), listSchools);
router.get("/:id", authMiddleware, checkRole([Role.SUPER_ADMIN]),  getSchoolsDetalhes);
router.patch("/:id", authMiddleware, checkRole([Role.SUPER_ADMIN]), schoolupdate);

export default router;