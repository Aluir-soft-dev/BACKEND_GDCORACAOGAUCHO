import type { Request, Response } from "express";
import { CheckoutService } from "../services/checkout.service.js";
import { ok } from "../lib/http.js";

const service = new CheckoutService();

export class CheckoutEventoController {
  async checkoutEvento(req: Request, res: Response) {
    const result = await service.criarIngressos({
      userId: req.auth!.userId,
      eventoId: req.body.eventoId,
      quantidade: req.body.quantidade,
      portadores: req.body.portadores,
      precoUnit: req.body.precoUnit,
    });

    return res.status(201).json(ok(result, "Checkout do evento realizado com sucesso."));
  }
}