import { Router } from "express";
import { createTeacher } from "../controllers/teacher.controller";
import { listTeachers } from "../controllers/teacher.controller";
import { updateTeacher } from "../controllers/teacher.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";


const router = Router();

router.post("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), createTeacher);
router.get("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), listTeachers);
router.patch("/:id", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), updateTeacher)

export default router;