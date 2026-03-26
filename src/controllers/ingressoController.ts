import type { Request, Response } from "express";
import { AppError, ok } from "../lib/http.js";
import { IngressoService } from "../services/ingresso.service.js";

const service = new IngressoService();

export class IngressoController {
  async listarPorUsuario(req: Request, res: Response) {
    const userId = (req.params.userId ? String(req.params.userId) : req.auth?.userId);
    if (!userId) throw new AppError(400, "INVALID_USER", "Usuário inválido.");
    const ingressos = await service.listByUser(userId);
    return res.json(ok({ total: ingressos.length, data: ingressos }));
  }

  async listarMeu(req: Request, res: Response) {
    const ingressos = await service.listByUser(req.auth!.userId);
    return res.json(ok({ total: ingressos.length, data: ingressos }));
  }

  async buscarPorId(req: Request, res: Response) {
    const ingresso = await service.getById(Number(req.params.id));

    if (ingresso.userId !== req.auth!.userId && !["ADMIN", "STAFF"].includes(req.auth!.role)) {
      throw new AppError(403, "FORBIDDEN", "Você não tem permissão para acessar este ingresso.");
    }

    return res.json(ok(ingresso));
  }
}
