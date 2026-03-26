import { randomUUID } from "node:crypto";
import { createBilling } from "../lib/abacatepay.js";
import { AppError } from "../lib/http.js";
import { PaymentRecordService } from "./payment-record.service.js";
import { prisma } from "../lib/prisma.js";
const paymentRecords = new PaymentRecordService();
function sanitizeTaxId(value) {
    return (value ?? "").replace(/\D/g, "");
}
function sanitizeCellphone(value) {
    return (value ?? "").replace(/\D/g, "");
}
function getUrls() {
    const returnUrl = process.env.ABACATEPAY_RETURN_URL || process.env.PAYMENT_PENDING_URL || process.env.FRONTEND_URL;
    const completionUrl = process.env.ABACATEPAY_COMPLETION_URL || process.env.PAYMENT_SUCCESS_URL || process.env.FRONTEND_URL;
    if (!returnUrl || !completionUrl) {
        throw new AppError(500, "ABACATEPAY_URLS_NOT_CONFIGURED", "Configure ABACATEPAY_RETURN_URL e ABACATEPAY_COMPLETION_URL no .env.");
    }
    return { returnUrl, completionUrl };
}
export class AbacatePayService {
    async createEventoCheckout(input) {
        const { returnUrl, completionUrl } = getUrls();
        const reference = `evt_${randomUUID()}`;
        const response = await createBilling({
            returnUrl,
            completionUrl,
            methods: ["PIX", "CARD"],
            customer: {
                name: input.user.name,
                email: input.user.email,
                cellphone: sanitizeCellphone(input.user.phone) || "48999999999",
                taxId: sanitizeTaxId(input.user.cpf) || "00000000000",
            },
            products: input.ingressos.map((ingresso) => ({
                externalId: `ingresso:${ingresso.id}`,
                name: input.ingressos.length > 1 ? `${input.ingressos[0].evento.nomeEvento} - Ingresso ${ingresso.id}` : input.ingressos[0].evento.nomeEvento,
                description: "Ingresso Coração Gaúcho",
                quantity: 1,
                price: Math.round(ingresso.preco * 100),
            })),
        });
        const billing = response.data;
        await paymentRecords.create({
            reference,
            kind: "EVENTO",
            userId: input.userId,
            targetIds: input.ingressos.map((item) => item.id),
            gatewayBillingId: billing.id,
            checkoutUrl: billing.url,
            amount: billing.amount,
            rawResponse: response,
        });
        return {
            gateway: "ABACATEPAY",
            reference,
            billingId: billing.id,
            checkoutUrl: billing.url,
            amountInCents: billing.amount,
            amount: billing.amount / 100,
            status: billing.status,
            methods: billing.methods ?? ["PIX", "CARD"],
            devMode: billing.devMode ?? false,
        };
    }
    async createCursoCheckout(input) {
        const { returnUrl, completionUrl } = getUrls();
        const reference = `cur_${randomUUID()}`;
        const response = await createBilling({
            returnUrl,
            completionUrl,
            methods: ["PIX", "CARD"],
            customer: {
                name: input.user.name,
                email: input.user.email,
                cellphone: sanitizeCellphone(input.user.phone) || "48999999999",
                taxId: sanitizeTaxId(input.user.cpf) || "00000000000",
            },
            products: [{
                    externalId: `inscricao:${input.inscricao.id}`,
                    name: input.inscricao.turma.nome,
                    description: "Inscrição em curso Coração Gaúcho",
                    quantity: 1,
                    price: Math.round(input.inscricao.preco * 100),
                }],
        });
        const billing = response.data;
        await paymentRecords.create({
            reference,
            kind: "CURSO",
            userId: input.userId,
            targetIds: [input.inscricao.id],
            gatewayBillingId: billing.id,
            checkoutUrl: billing.url,
            amount: billing.amount,
            rawResponse: response,
        });
        return {
            gateway: "ABACATEPAY",
            reference,
            billingId: billing.id,
            checkoutUrl: billing.url,
            amountInCents: billing.amount,
            amount: billing.amount / 100,
            status: billing.status,
            methods: billing.methods ?? ["PIX", "CARD"],
            devMode: billing.devMode ?? false,
        };
    }
    async processWebhook(payload) {
        const event = payload.event;
        const billingId = payload.data?.checkout?.id;
        if (!event || !billingId) {
            throw new AppError(400, "INVALID_WEBHOOK", "Payload do webhook não contém event ou checkout.id.");
        }
        const record = await paymentRecords.findByGatewayBillingId(billingId);
        if (!record) {
            return { handled: false, reason: "PAYMENT_RECORD_NOT_FOUND" };
        }
        if (event === "checkout.completed") {
            await paymentRecords.updateStatusByGatewayBillingId(billingId, "PAID", payload);
            if (record.kind === "EVENTO") {
                await prisma.ingresso.updateMany({ where: { id: { in: record.targetIds } }, data: { status: "DISPONIVEL" } });
            }
            else {
                await prisma.inscricao.updateMany({ where: { id: { in: record.targetIds } }, data: { status: "CONFIRMADA" } });
            }
            return { handled: true, action: "PAID", record };
        }
        if (event === "checkout.refunded" || event === "checkout.disputed") {
            await paymentRecords.updateStatusByGatewayBillingId(billingId, event === "checkout.refunded" ? "REFUNDED" : "DISPUTED", payload);
            if (record.kind === "EVENTO") {
                await prisma.ingresso.updateMany({ where: { id: { in: record.targetIds } }, data: { status: "CANCELADO" } });
            }
            else {
                await prisma.inscricao.updateMany({ where: { id: { in: record.targetIds } }, data: { status: "CANCELADA" } });
            }
            return { handled: true, action: event, record };
        }
        return { handled: false, reason: "EVENT_IGNORED", event };
    }
}
