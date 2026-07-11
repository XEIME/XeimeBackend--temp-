import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/role.middleware";
import { createSubject, getSubjects } from "../controllers/subject.controller";

const router = Router();

router.get(
  "/subjects",
  authMiddleware,
  checkRole([Role.SCHOOL_ADMIN, Role.TEACHER]),
  getSubjects,
);

router.post(
  "/subjects",
  authMiddleware,
  checkRole([Role.SCHOOL_ADMIN]),
  createSubject,
);

export default router;