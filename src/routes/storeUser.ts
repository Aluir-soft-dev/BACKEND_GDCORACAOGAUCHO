import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import { updateProfileSchema } from "../schemas/user.schema.js";
import { StoreUserController } from "../controllers/storeUserController.js";

const router = Router();
const controller = new StoreUserController();

router.use(requireAuth, requireRole("USER"));

router.get("/resumo", (req, res, next) => controller.resumo(req, res).catch(next));
router.get("/perfil", (req, res, next) => controller.perfil(req, res).catch(next));
router.put("/perfil", validate(updateProfileSchema), (req, res, next) =>
  controller.atualizarPerfil(req, res).catch(next),
);
router.get("/compras", (req, res, next) => controller.compras(req, res).catch(next));
router.get("/ingressos", (req, res, next) => controller.ingressos(req, res).catch(next));
router.get("/ingressos/:id", (req, res, next) => controller.ingressoPorId(req, res).catch(next));
router.get("/inscricoes", (req, res, next) => controller.inscricoes(req, res).catch(next));
router.get("/inscricoes/:id", (req, res, next) => controller.inscricaoPorId(req, res).catch(next));

export default router;
