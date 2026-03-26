import { AppError, ok } from "../lib/http.js";
import { InscricaoService } from "../services/inscricao.service.js";
const service = new InscricaoService();
export class InscricaoController {
    async listarPorUsuario(req, res) {
        const userId = (req.params.userId ? String(req.params.userId) : req.auth?.userId);
        if (!userId)
            throw new AppError(400, "INVALID_USER", "Usuário inválido.");
        const inscricoes = await service.listByUser(userId);
        return res.json(ok({ total: inscricoes.length, data: inscricoes }));
    }
    async listarMinhas(req, res) {
        const inscricoes = await service.listByUser(req.auth.userId);
        return res.json(ok({ total: inscricoes.length, data: inscricoes }));
    }
    async buscarPorId(req, res) {
        const inscricao = await service.getById(Number(req.params.id));
        if (inscricao.userId !== req.auth.userId && !["ADMIN", "STAFF"].includes(req.auth.role)) {
            throw new AppError(403, "FORBIDDEN", "Você não tem permissão para acessar esta inscrição.");
        }
        return res.json(ok(inscricao));
    }
}
