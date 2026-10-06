import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { getStudentDashboard } from "../controllers/studentPortal.controller";

const router = Router();

router.get(
  "/student/dashboard",
  authMiddleware,
  checkRole([Role.STUDENT]),
  getStudentDashboard,
);

export default router;