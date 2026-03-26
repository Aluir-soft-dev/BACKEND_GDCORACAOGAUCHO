import { Router } from "express";
import { IngressoController } from "../controllers/ingressoController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { requireSelfOrRole } from "../middlewares/ownership.js";

const router = Router();
const controller = new IngressoController();

router.get("/ingressos/me", requireAuth, (req, res, next) =>
  controller.listarMeu(req, res).catch(next),
);

router.get(
  "/ingressos/usuario/:userId",
  requireAuth,
  requireSelfOrRole("ADMIN", "STAFF"),
  (req, res, next) => controller.listarPorUsuario(req, res).catch(next),
);

router.get("/ingresso/:id", requireAuth, (req, res, next) =>
  controller.buscarPorId(req, res).catch(next),
);

export default router;