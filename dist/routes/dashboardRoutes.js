import { Router } from "express";
import { dashboard } from "../controllers/dashboardController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
const router = Router();
router.get("/", requireAuth, requireRole("ADMIN", "STAFF"), dashboard);
export default router;
