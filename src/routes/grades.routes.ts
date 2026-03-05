import { Router } from "express";
import { getGrades } from "../controllers/grade.controller";
import { generateGrades } from "../controllers/grade.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), generateGrades);
router.get("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), getGrades);

export default router;