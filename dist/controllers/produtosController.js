import { AppError, ok } from "../lib/http.js";
import { ProdutoService } from "../services/produto.service.js";
const service = new ProdutoService();
export async function listar(_req, res) {
    return res.json(ok(await service.list()));
}
export async function obter(req, res) {
    const produto = await service.getById(Number(req.params.id));
    if (!produto)
        throw new AppError(404, "PRODUCT_NOT_FOUND", "Produto não encontrado.");
    return res.json(ok(produto));
}
export async function criar(req, res) {
    const produto = await service.create(req.body);
    return res.status(201).json(ok(produto, "Produto criado com sucesso."));
}
export async function atualizar(req, res) {
    const produto = await service.update(Number(req.params.id), req.body);
    return res.json(ok(produto, "Produto atualizado com sucesso."));
}
export async function remover(req, res) {
    const removed = await service.remove(Number(req.params.id));
    if (!removed)
        throw new AppError(404, "PRODUCT_NOT_FOUND", "Produto não encontrado.");
    return res.json(ok({ removed: true }, "Produto removido com sucesso."));
}
