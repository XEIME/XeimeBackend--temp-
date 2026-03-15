import { Router } from "express";
import { creatStudentAndParent } from "../controllers/studentAndParent.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/students", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), creatStudentAndParent);

export default router;

