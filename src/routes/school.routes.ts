import { Router } from "express";
import { createSchoolWithAdmin } from "../controllers/school.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createSchoolWithAdmin)

export default router;