import { Router } from "express";
import { ListagemController } from "../controllers/listagemController.js";
const router = Router();
const controller = new ListagemController();
router.get("/eventos", (req, res, next) => controller.eventos(req, res).catch(next));
router.get("/cursos", (req, res, next) => controller.cursos(req, res).catch(next));
export default router;
