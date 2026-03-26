import { UserService } from "../services/user.service.js";
import { ok } from "../lib/http.js";
const service = new UserService();
export class UsuarioPerfilController {
    async buscar(req, res) {
        const userId = req.params.userId ? String(req.params.userId) : req.auth.userId;
        const usuario = await service.getProfile(userId);
        return res.status(200).json(ok(usuario));
    }
    async buscarMeu(req, res) {
        const usuario = await service.getProfile(req.auth.userId);
        return res.status(200).json(ok(usuario));
    }
    async atualizar(req, res) {
        const userId = req.params.userId ? String(req.params.userId) : req.auth.userId;
        const usuarioAtualizado = await service.updateProfile(userId, {
            nome: req.body.nome,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            endereco: req.body.endereco,
            cidade: req.body.cidade,
            estado: req.body.estado,
            email: req.body.email,
            senha: req.body.senha,
        });
        return res.status(200).json(ok(usuarioAtualizado, "Dados atualizados com sucesso."));
    }
    async atualizarMeu(req, res) {
        const usuarioAtualizado = await service.updateProfile(req.auth.userId, {
            nome: req.body.nome,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            endereco: req.body.endereco,
            cidade: req.body.cidade,
            estado: req.body.estado,
            email: req.body.email,
            senha: req.body.senha,
        });
        return res.status(200).json(ok(usuarioAtualizado, "Dados atualizados com sucesso."));
    }
}
