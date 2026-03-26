import { prisma } from "../lib/prisma.js";
import { deleteFromCloudinary, extractImageIdFromUrl } from "../lib/cloudinary.js";

export class EventoService {
  list() {
    return prisma.evento.findMany({ orderBy: { data: "asc" } });
  }

  getById(id: number) {
    return prisma.evento.findUnique({ where: { id } });
  }

  getNext() {
    return prisma.evento.findFirst({
      where: { data: { gte: new Date() } },
      orderBy: { data: "asc" },
    });
  }

  create(data: {
    nomeEvento: string;
    local: string;
    data: Date;
    descricao?: string | null;
    atracao?: string | null;
    preco?: number | null;
    imagens?: string[];
    status?: string;
  }) {
    return prisma.evento.create({ data });
  }

  update(
    id: number,
    data: Partial<{
      nomeEvento: string;
      local: string;
      data: Date;
      descricao?: string | null;
      atracao?: string | null;
      preco?: number | null;
      imagens?: string[];
      status?: string;
    }>,
  ) {
    return prisma.evento.update({ where: { id }, data });
  }

  async remove(id: number) {
    const evento = await prisma.evento.findUnique({ where: { id } });
    if (!evento) return null;

    // Deleta todas as imagens do Cloudflare
    for (const imageUrl of evento.imagens) {
      const imageId = extractImageIdFromUrl(imageUrl);
      if (imageId) {
        await deleteFromCloudinary(imageId);
      }
    }

    await prisma.evento.delete({ where: { id } });
    return true;
  }
}