import { prisma } from "../lib/prisma.js";
import { deleteFromCloudinary, extractImageIdFromUrl } from "../lib/cloudinary.js";
export class TurmaService {
    list() {
        return prisma.turma.findMany({ orderBy: { dataHora: "asc" } });
    }
    getById(id) {
        return prisma.turma.findUnique({ where: { id } });
    }
    getNext() {
        return prisma.turma.findFirst({
            where: { dataHora: { gte: new Date() } },
            orderBy: { dataHora: "asc" },
        });
    }
    create(data) {
        return prisma.turma.create({ data });
    }
    update(id, data) {
        return prisma.turma.update({ where: { id }, data });
    }
    async remove(id) {
        const turma = await prisma.turma.findUnique({ where: { id } });
        if (!turma)
            return null;
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
