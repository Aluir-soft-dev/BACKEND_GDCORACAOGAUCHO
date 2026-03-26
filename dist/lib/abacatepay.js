import crypto from "node:crypto";
import { AppError } from "./http.js";
const baseUrl = process.env.ABACATEPAY_BASE_URL || "https://api.abacatepay.com/v1";
function getApiKey() {
    const apiKey = process.env.ABACATEPAY_API_KEY;
    if (!apiKey) {
        throw new AppError(500, "ABACATEPAY_NOT_CONFIGURED", "ABACATEPAY_API_KEY não configurada no .env.");
    }
    return apiKey;
}
async function abacateRequest(path, init) {
    const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${getApiKey()}`,
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok || json?.error) {
        throw new AppError(response.status || 500, "ABACATEPAY_REQUEST_FAILED", json?.error?.message || json?.message || "Falha ao comunicar com a AbacatePay.", json);
    }
    return json;
}
export async function createBilling(input) {
    return abacateRequest("/billing/create", {
        method: "POST",
        body: JSON.stringify({
            frequency: "ONE_TIME",
            methods: input.methods,
            products: input.products,
            returnUrl: input.returnUrl,
            completionUrl: input.completionUrl,
            customer: input.customer,
        }),
    });
}
export function verifyAbacateSignature(rawBody, signatureFromHeader) {
    const publicKey = process.env.ABACATEPAY_PUBLIC_WEBHOOK_KEY;
    if (!publicKey) {
        throw new AppError(500, "ABACATEPAY_WEBHOOK_NOT_CONFIGURED", "ABACATEPAY_PUBLIC_WEBHOOK_KEY não configurada no .env.");
    }
    const expectedSig = crypto.createHmac("sha256", publicKey).update(Buffer.from(rawBody, "utf8")).digest("base64");
    const A = Buffer.from(expectedSig);
    const B = Buffer.from(signatureFromHeader);
    return A.length === B.length && crypto.timingSafeEqual(A, B);
}
