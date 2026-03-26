import { prisma } from "../lib/prisma.js";

export class DashboardService {
  async getSummary() {
    const [produtos, categorias, eventos, turmas, usuarios, ingressos, inscricoes] =
      await Promise.all([
        prisma.produto.count(),
        prisma.categoria.count(),
        prisma.evento.count(),
        prisma.turma.count(),
        prisma.user.count(),
        prisma.ingresso.count(),
        prisma.inscricao.count(),
      ]);

    return {
      produtos,
      categorias,
      eventos,
      turmas,
      usuarios,
      ingressos,
      inscricoes,
    };
  }
}