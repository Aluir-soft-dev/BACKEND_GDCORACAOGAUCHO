import type { Request, Response } from "express";
import { CategoriaService } from "../services/categoria.service.js";
import { ok } from "../lib/http.js";

const service = new CategoriaService();

export async function listar(_req: Request, res: Response) {
  const categorias = await service.list();
  return res.json(ok(categorias));
}

export async function criar(req: Request, res: Response) {
  const categoria = await service.create(req.body.nome);
  return res.status(201).json(ok(categoria, "Categoria criada com sucesso."));
}