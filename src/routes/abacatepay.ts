import { Router } from "express";
import { AbacatePayController } from "../controllers/abacatepayController.js";

const router = Router();
const controller = new AbacatePayController();

router.post("/webhook", (req, res, next) => controller.webhook(req, res).catch(next));

export default router;
