import { prisma } from "../lib/prisma.js";
export class PaymentRecordService {
    async ensureTable() {
        await prisma.$executeRaw `
      CREATE TABLE IF NOT EXISTS payment_record (
        id SERIAL PRIMARY KEY,
        reference VARCHAR(191) NOT NULL UNIQUE,
        kind VARCHAR(30) NOT NULL,
        user_id VARCHAR(191) NOT NULL,
        target_ids_json TEXT NOT NULL,
        gateway_billing_id VARCHAR(191),
        checkout_url TEXT,
        amount INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
        raw_response_json TEXT,
        raw_webhook_json TEXT,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
        await prisma.$executeRaw `CREATE INDEX IF NOT EXISTS payment_record_gateway_billing_id_idx ON payment_record(gateway_billing_id);`;
    }
    async create(input) {
        await this.ensureTable();
        await prisma.$executeRaw `
      INSERT INTO payment_record(reference, kind, user_id, target_ids_json, gateway_billing_id, checkout_url, amount, status, raw_response_json)
      VALUES (
        ${input.reference},
        ${input.kind},
        ${input.userId},
        ${JSON.stringify(input.targetIds)},
        ${input.gatewayBillingId},
        ${input.checkoutUrl},
        ${input.amount},
        ${"PENDING"},
        ${JSON.stringify(input.rawResponse)}
      );
    `;
    }
    async findByGatewayBillingId(gatewayBillingId) {
        await this.ensureTable();
        const rows = await prisma.$queryRaw `
      SELECT * FROM payment_record WHERE gateway_billing_id = ${gatewayBillingId} LIMIT 1
    `;
        const row = rows[0];
        if (!row)
            return null;
        return {
            id: row.id,
            reference: row.reference,
            kind: row.kind,
            userId: row.user_id,
            targetIds: JSON.parse(row.target_ids_json),
            gatewayBillingId: row.gateway_billing_id,
            checkoutUrl: row.checkout_url,
            amount: row.amount,
            status: row.status,
        };
    }
    async updateStatusByGatewayBillingId(gatewayBillingId, status, rawWebhook) {
        await this.ensureTable();
        await prisma.$executeRaw `
      UPDATE payment_record
      SET status = ${status}, raw_webhook_json = ${JSON.stringify(rawWebhook)}, updated_at = CURRENT_TIMESTAMP
      WHERE gateway_billing_id = ${gatewayBillingId}
    `;
    }
}
