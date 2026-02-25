import { Router } from "express";
import { createSchoolWithAdmin } from "../controllers/school.controller";
import { listSchools } from "../controllers/school.controller";
import { getSchoolsDetalhes } from "../controllers/school.controller";
import { schoolupdate } from "../controllers/school.controller";
import { authMiddleware } from "../middlewares/auth.middleware";



const router = Router();

router.post("/", authMiddleware, createSchoolWithAdmin);
router.get("/", authMiddleware, listSchools);
router.get("/:id", authMiddleware, getSchoolsDetalhes);
router.patch("/:id", authMiddleware, schoolupdate);

export default router;