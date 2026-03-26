import { Router } from "express";
import { InscricaoController } from "../controllers/inscricaoController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireSelfOrRole } from "../middlewares/ownership.js";

const router = Router();
const controller = new InscricaoController();

router.get("/inscricoes/me", requireAuth, (req, res, next) =>
  controller.listarMinhas(req, res).catch(next),
);

router.get(
  "/inscricoes/:userId",
  requireAuth,
  requireSelfOrRole("ADMIN", "STAFF"),
  (req, res, next) => controller.listarPorUsuario(req, res).catch(next),
);

router.get("/inscricao/:id", requireAuth, (req, res, next) =>
  controller.buscarPorId(req, res).catch(next),
);

export default router;