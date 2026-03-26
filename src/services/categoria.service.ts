import { prisma } from "../lib/prisma.js";

export class CategoriaService {
  list() {
    return prisma.categoria.findMany({
      orderBy: { nome: "asc" },
      include: {
        _count: { select: { produtos: true } },
      },
    });
  }

  create(nome: string) {
    return prisma.categoria.create({ data: { nome } });
  }
}