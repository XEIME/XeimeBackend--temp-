import { Router } from "express";
import { generetClass } from "../controllers/class.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/", authMiddleware, checkRole([Role.SCHOOL_ADMIN]), generetClass)

export default router;


