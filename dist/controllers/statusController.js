import { CheckoutService } from "../services/checkout.service.js";
import { ok } from "../lib/http.js";
const service = new CheckoutService();
export class StatusController {
    async ingresso(req, res) {
        const data = await service.atualizarStatusIngresso(Number(req.params.id), req.body.status);
        return res.json(ok(data, "Status do ingresso atualizado com sucesso."));
    }
    async inscricao(req, res) {
        const data = await service.atualizarStatusInscricao(Number(req.params.id), req.body.status);
        return res.json(ok(data, "Status da inscrição atualizado com sucesso."));
    }
}
