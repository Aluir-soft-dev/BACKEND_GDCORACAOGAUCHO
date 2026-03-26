import { prisma } from "../lib/prisma.js";
import { deleteFromCloudinary, extractImageIdFromUrl } from "../lib/cloudinary.js";

export class TurmaService {
  list() {
    return prisma.turma.findMany({ orderBy: { dataHora: "asc" } });
  }

  getById(id: number) {
    return prisma.turma.findUnique({ where: { id } });
  }

  getNext() {
    return prisma.turma.findFirst({
      where: { dataHora: { gte: new Date() } },
      orderBy: { dataHora: "asc" },
    });
  }

  create(data: {
    nome: string;
    local: string;
    dataHora: Date;
    descricao?: string | null;
    preco: number;
    nivel: string;
    imagens?: string[];
  }) {
    return prisma.turma.create({ data });
  }

  update(
    id: number,
    data: Partial<{
      nome: string;
      local: string;
      dataHora: Date;
      descricao?: string | null;
      preco: number;
      nivel: string;
      imagens?: string[];
    }>,
  ) {
    return prisma.turma.update({ where: { id }, data });
  }

  async remove(id: number) {
    const turma = await prisma.turma.findUnique({ where: { id } });
    if (!turma) return null;

    // Deleta todas as imagens do Cloudflare
    for (const imageUrl of turma.imagens) {
      const imageId = extractImageIdFromUrl(imageUrl);
      if (imageId) {
        await deleteFromCloudinary(imageId);
      }
    }

    await prisma.turma.delete({ where: { id } });
    return true;
  }
}