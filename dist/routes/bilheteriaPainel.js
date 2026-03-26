import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
const router = Router();
router.get("/", requireAuth, requireRole("ADMIN", "STAFF"), (_req, res) => {
    return res.json({
        success: true,
        message: "Acesso autorizado ao painel.",
    });
});
export default router;
