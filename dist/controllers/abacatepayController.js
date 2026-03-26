import { verifyAbacateSignature } from "../lib/abacatepay.js";
import { ok } from "../lib/http.js";
import { AbacatePayService } from "../services/abacatepay.service.js";
const service = new AbacatePayService();
export class AbacatePayController {
    async webhook(req, res) {
        const webhookSecret = req.query.webhookSecret;
        if (webhookSecret !== process.env.ABACATEPAY_WEBHOOK_SECRET) {
            return res.status(401).json({ success: false, code: "UNAUTHORIZED", message: "webhookSecret inválido." });
        }
        const signature = req.header("X-Webhook-Signature");
        if (signature && process.env.ABACATEPAY_PUBLIC_WEBHOOK_KEY) {
            const valid = verifyAbacateSignature(req.rawBody ?? JSON.stringify(req.body), signature);
            if (!valid) {
                return res.status(401).json({ success: false, code: "INVALID_SIGNATURE", message: "Assinatura do webhook inválida." });
            }
        }
        const result = await service.processWebhook(req.body);
        return res.status(200).json(ok(result, "Webhook processado."));
    }
}
