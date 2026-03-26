import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/http.js";
import { UserService } from "./user.service.js";

const userService = new UserService();

export class StoreUserService {
  async getSummary(userId: string) {
    const perfil = await userService.getProfile(userId);

    const [ingressos, inscricoes] = await Promise.all([
      prisma.ingresso.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { evento: true },
      }),
      prisma.inscricao.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { turma: true },
      }),
    ]);

    return {
      perfil,
      totais: {
        ingressos: ingressos.length,
        inscricoes: inscricoes.length,
        compras: ingressos.length + inscricoes.length,
      },
      ultimosIngressos: ingressos.slice(0, 5),
      ultimasInscricoes: inscricoes.slice(0, 5),
    };
  }

  async getPurchases(userId: string) {
    const [ingressos, inscricoes] = await Promise.all([
      prisma.ingresso.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { evento: true },
      }),
      prisma.inscricao.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { turma: true },
      }),
    ]);

    return {
      ingressos,
      inscricoes,
      totalCompras: ingressos.length + inscricoes.length,
    };
  }

  async getMyTicketById(userId: string, ingressoId: number) {
    const ingresso = await prisma.ingresso.findUnique({
      where: { id: ingressoId },
      include: { usuario: true, evento: true },
    });

    if (!ingresso) {
      throw new AppError(404, "TICKET_NOT_FOUND", "Ingresso não encontrado.");
    }

    if (ingresso.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "Você não tem permissão para acessar este ingresso.");
    }

    return ingresso;
  }

  async getMyEnrollmentById(userId: string, inscricaoId: number) {
    const inscricao = await prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      include: { usuario: true, turma: true },
    });

    if (!inscricao) {
      throw new AppError(404, "ENROLLMENT_NOT_FOUND", "Inscrição não encontrada.");
    }

    if (inscricao.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "Você não tem permissão para acessar esta inscrição.");
    }

    return inscricao;
  }
}
