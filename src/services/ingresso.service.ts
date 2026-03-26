import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/http.js";

export class IngressoService {
  listByUser(userId: string) {
    return prisma.ingresso.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        usuario: true,
        evento: true,
      },
    });
  }

  async getById(id: number) {
    const ingresso = await prisma.ingresso.findUnique({
      where: { id },
      include: {
        usuario: true,
        evento: true,
      },
    });

    if (!ingresso) {
      throw new AppError(404, "TICKET_NOT_FOUND", "Ingresso não encontrado.");
    }

    return {
      ...ingresso,
      qrcodeImage: `/uploads/qr/${ingresso.qrcode}.png`,
    };
  }
}