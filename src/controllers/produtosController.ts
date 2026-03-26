import type { Request, Response } from "express";
import { AppError, ok } from "../lib/http.js";
import { ProdutoService } from "../services/produto.service.js";

const service = new ProdutoService();

export async function listar(_req: Request, res: Response) {
  return res.json(ok(await service.list()));
}

export async function obter(req: Request, res: Response) {
  const produto = await service.getById(Number(req.params.id));
  if (!produto) throw new AppError(404, "PRODUCT_NOT_FOUND", "Produto não encontrado.");
  return res.json(ok(produto));
}

export async function criar(req: Request, res: Response) {
  const produto = await service.create(req.body);
  return res.status(201).json(ok(produto, "Produto criado com sucesso."));
}

export async function atualizar(req: Request, res: Response) {
  const produto = await service.update(Number(req.params.id), req.body);
  return res.json(ok(produto, "Produto atualizado com sucesso."));
}

export async function remover(req: Request, res: Response) {
  const removed = await service.remove(Number(req.params.id));
  if (!removed) throw new AppError(404, "PRODUCT_NOT_FOUND", "Produto não encontrado.");
  return res.json(ok({ removed: true }, "Produto removido com sucesso."));
}