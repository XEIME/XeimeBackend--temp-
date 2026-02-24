import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.post('/login', login)

router.get('/me', authMiddleware, (req, res) => {
    return res.json({message: "Tu estás autenticado",
        user: req.user
    })
});

export default router;
