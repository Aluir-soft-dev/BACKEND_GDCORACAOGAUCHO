import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/http.js";

export class InscricaoService {
  listByUser(userId: string) {
    return prisma.inscricao.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        usuario: true,
        turma: true,
      },
    });
  }

  async getById(id: number) {
    const inscricao = await prisma.inscricao.findUnique({
      where: { id },
      include: {
        usuario: true,
        turma: true,
      },
    });

    if (!inscricao) {
      throw new AppError(404, "ENROLLMENT_NOT_FOUND", "Inscrição não encontrada.");
    }

    return {
      ...inscricao,
      qrcodeImage: `/uploads/qr/${inscricao.qrcode}.png`,
    };
  }
}