import { Router } from "express";
import { createTeacher } from "../controllers/teacher.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), createTeacher);

export default router;