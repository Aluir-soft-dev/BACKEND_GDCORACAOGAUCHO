import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { ok } from "../lib/http.js";

export class ListagemController {
  async eventos(_req: Request, res: Response) {
    const eventos = await prisma.evento.findMany({ orderBy: { data: "asc" } });
    return res.json(ok(eventos));
  }

  async cursos(_req: Request, res: Response) {
    const cursos = await prisma.turma.findMany({ orderBy: { dataHora: "asc" } });
    return res.json(ok(cursos));
  }
}