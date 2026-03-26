import { Router } from "express";
import * as controller from "../controllers/turmasController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import { createTurmaSchema, updateTurmaSchema } from "../schemas/turma.schema.js";

const router = Router();

router.get("/proxima", controller.proximaTurma);
router.get("/", controller.listar);
router.get("/:id", controller.obter);
router.post("/", requireAuth, requireRole("ADMIN", "STAFF"), validate(createTurmaSchema), controller.criar);
router.put("/:id", requireAuth, requireRole("ADMIN", "STAFF"), validate(updateTurmaSchema), controller.atualizar);
router.delete("/:id", requireAuth, requireRole("ADMIN", "STAFF"), controller.remover);

export default router;