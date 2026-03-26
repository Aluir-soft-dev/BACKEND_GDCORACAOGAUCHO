import type { Request, Response } from "express";
import { AppError, ok } from "../lib/http.js";
import { EventoService } from "../services/evento.service.js";

const service = new EventoService();

export async function listar(_req: Request, res: Response) {
  return res.json(ok(await service.list()));
}

export async function obter(req: Request, res: Response) {
  const evento = await service.getById(Number(req.params.id));
  if (!evento) throw new AppError(404, "EVENT_NOT_FOUND", "Evento não encontrado.");
  return res.json(ok(evento));
}

export async function criar(req: Request, res: Response) {
  const evento = await service.create(req.body);
  return res.status(201).json(ok(evento, "Evento criado com sucesso."));
}

export async function atualizar(req: Request, res: Response) {
  const evento = await service.update(Number(req.params.id), req.body);
  return res.json(ok(evento, "Evento atualizado com sucesso."));
}

export async function remover(req: Request, res: Response) {
  const removed = await service.remove(Number(req.params.id));
  if (!removed) throw new AppError(404, "EVENT_NOT_FOUND", "Evento não encontrado.");
  return res.json(ok({ removed: true }, "Evento removido com sucesso."));
}

export async function proximoEvento(_req: Request, res: Response) {
  return res.json(ok(await service.getNext()));
}