import { prisma } from "../lib/prisma.js";
import { deleteFromCloudinary, extractImageIdFromUrl } from "../lib/cloudinary.js";

export class ProdutoService {
  list() {
    return prisma.produto.findMany({
      include: { categoriaRef: true },
      orderBy: { createdAt: "desc" },
    });
  }

  getById(id: number) {
    return prisma.produto.findUnique({
      where: { id },
      include: { categoriaRef: true },
    });
  }

  create(data: {
    nome: string;
    quantidade: number;
    preco: number;
    descricao?: string | null;
    imagem?: string | null;
    categoria?: string | null;
    categoriaId?: number | null;
  }) {
    return prisma.produto.create({ data });
  }

  async update(
    id: number,
    data: Partial<{
      nome: string;
      quantidade: number;
      preco: number;
      descricao?: string | null;
      imagem?: string | null;
      categoria?: string | null;
      categoriaId?: number | null;
    }>,
  ) {
    const current = await prisma.produto.findUnique({ where: { id } });
    const updated = await prisma.produto.update({ where: { id }, data });

    // Se a imagem foi alterada, deleta a antiga do Cloudflare
    if (data.imagem && current?.imagem && current.imagem !== data.imagem) {
      const imageId = extractImageIdFromUrl(current.imagem);
      if (imageId) {
        await deleteFromCloudinary(imageId);
      }
    }

    return updated;
  }

  async remove(id: number) {
    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) return null;

    // Deleta a imagem do Cloudflare se existir
    if (produto.imagem) {
      const imageId = extractImageIdFromUrl(produto.imagem);
      if (imageId) {
        await deleteFromCloudinary(imageId);
      }
    }

    await prisma.produto.delete({ where: { id } });
    return true;
  }
}