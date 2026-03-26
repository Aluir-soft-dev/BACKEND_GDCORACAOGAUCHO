import { Router } from "express";
import * as controller from "../controllers/eventosController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import { createEventoSchema, updateEventoSchema } from "../schemas/evento.schema.js";

const router = Router();

router.get("/proximo", controller.proximoEvento);
router.get("/", controller.listar);
router.get("/:id", controller.obter);
router.post("/", requireAuth, requireRole("ADMIN"), validate(createEventoSchema), controller.criar);
router.put("/:id", requireAuth, requireRole("ADMIN"), validate(updateEventoSchema), controller.atualizar);
router.delete("/:id", requireAuth, requireRole("ADMIN"), controller.remover);

export default router;