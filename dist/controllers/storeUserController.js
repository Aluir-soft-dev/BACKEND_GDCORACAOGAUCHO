import { ok } from "../lib/http.js";
import { UserService } from "../services/user.service.js";
import { StoreUserService } from "../services/storeUser.service.js";
const userService = new UserService();
const storeService = new StoreUserService();
export class StoreUserController {
    async resumo(req, res) {
        const data = await storeService.getSummary(req.auth.userId);
        return res.json(ok(data));
    }
    async perfil(req, res) {
        const data = await userService.getProfile(req.auth.userId);
        return res.json(ok(data));
    }
    async atualizarPerfil(req, res) {
        const data = await userService.updateProfile(req.auth.userId, {
            nome: req.body.nome,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            endereco: req.body.endereco,
            cidade: req.body.cidade,
            estado: req.body.estado,
            email: req.body.email,
            senha: req.body.senha,
        });
        return res.json(ok(data, "Perfil atualizado com sucesso."));
    }
    async compras(req, res) {
        const data = await storeService.getPurchases(req.auth.userId);
        return res.json(ok(data));
    }
    async ingressos(req, res) {
        const data = await storeService.getPurchases(req.auth.userId);
        return res.json(ok({ total: data.ingressos.length, data: data.ingressos }));
    }
    async inscricoes(req, res) {
        const data = await storeService.getPurchases(req.auth.userId);
        return res.json(ok({ total: data.inscricoes.length, data: data.inscricoes }));
    }
    async ingressoPorId(req, res) {
        const data = await storeService.getMyTicketById(req.auth.userId, Number(req.params.id));
        return res.json(ok(data));
    }
    async inscricaoPorId(req, res) {
        const data = await storeService.getMyEnrollmentById(req.auth.userId, Number(req.params.id));
        return res.json(ok(data));
    }
}
