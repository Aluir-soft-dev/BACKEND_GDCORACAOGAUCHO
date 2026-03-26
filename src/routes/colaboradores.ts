import { Router } from "express";
import {
  listar,
  criar,
  atualizar,
  excluir,
  me,
  logout,
} from "../controllers/colaboradoresController.js";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import { createCollaboratorSchema, updateCollaboratorSchema } from "../schemas/user.schema.js";

const router = Router();

router.get("/me", requireAuth, requireRole("ADMIN", "STAFF"), me);
router.get("/", requireAuth, requireRole("ADMIN"), listar);
router.post("/", requireAuth, requireRole("ADMIN"), validate(createCollaboratorSchema), criar);
router.put("/:id", requireAuth, requireRole("ADMIN"), validate(updateCollaboratorSchema), atualizar);
router.delete("/:id", requireAuth, requireRole("ADMIN"), excluir);
router.post("/logout", logout);

export default router;