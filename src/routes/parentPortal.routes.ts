import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import {
  getParentChildren,
  getStudentSituation,
} from "../controllers/parentPortal.controller";

const router = Router();

router.get(
  "/parent/children",
  authMiddleware,
  checkRole([Role.PARENT]),
  getParentChildren,
);

router.get(
  "/parent/students/:studentId/situation",
  authMiddleware,
  checkRole([Role.PARENT]),
  getStudentSituation,
);

export default router;