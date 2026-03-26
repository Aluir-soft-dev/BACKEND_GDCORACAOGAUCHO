import type { Request, Response } from "express";
import { AppError, ok } from "../lib/http.js";
import { UserService } from "../services/user.service.js";

const service = new UserService();

export async function listar(_req: Request, res: Response) {
  return res.json(ok(await service.listCollaborators()));
}

export async function criar(req: Request, res: Response) {
  const user = await service.createCollaborator(req.body);
  return res.status(201).json(ok(user, "Colaborador criado com sucesso."));
}

export async function atualizar(req: Request, res: Response) {
  const user = await service.updateCollaborator(String(req.params.id), req.body);
  return res.json(ok(user, "Colaborador atualizado com sucesso."));
}

export async function excluir(req: Request, res: Response) {
  await service.deleteCollaborator(String(req.params.id));
  return res.json(ok({ removed: true }, "Colaborador removido com sucesso."));
}

export async function me(req: Request, res: Response) {
  if (!req.auth) throw new AppError(401, "UNAUTHORIZED", "Você precisa estar logado.");
  const profile = await service.getProfile(req.auth.userId);
  return res.json(ok(profile));
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("better-auth.session_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.clearCookie("__Secure-better-auth.session_token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  return res.json(ok({ loggedOut: true }, "Logout realizado com sucesso."));
}