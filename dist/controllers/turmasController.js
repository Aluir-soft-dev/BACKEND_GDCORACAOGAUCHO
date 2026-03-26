import { AppError, ok } from "../lib/http.js";
import { TurmaService } from "../services/turma.service.js";
const service = new TurmaService();
export async function listar(_req, res) {
    return res.json(ok(await service.list()));
}
export async function obter(req, res) {
    const turma = await service.getById(Number(req.params.id));
    if (!turma)
        throw new AppError(404, "CLASS_NOT_FOUND", "Turma não encontrada.");
    return res.json(ok(turma));
}
export async function criar(req, res) {
    const turma = await service.create(req.body);
    return res.status(201).json(ok(turma, "Turma criada com sucesso."));
}
export async function atualizar(req, res) {
    const turma = await service.update(Number(req.params.id), req.body);
    return res.json(ok(turma, "Turma atualizada com sucesso."));
}
export async function remover(req, res) {
    const removed = await service.remove(Number(req.params.id));
    if (!removed)
        throw new AppError(404, "CLASS_NOT_FOUND", "Turma não encontrada.");
    return res.json(ok({ removed: true }, "Turma removida com sucesso."));
}
export async function proximaTurma(_req, res) {
    return res.json(ok(await service.getNext()));
}
