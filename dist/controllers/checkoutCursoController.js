import { CheckoutService } from "../services/checkout.service.js";
import { ok } from "../lib/http.js";
const service = new CheckoutService();
export class CheckoutCursoController {
    async checkoutCurso(req, res) {
        const result = await service.criarInscricao({
            userId: req.auth.userId,
            turmaId: req.body.turmaId,
        });
        return res.status(201).json(ok(result, "Checkout do curso realizado com sucesso."));
    }
}
