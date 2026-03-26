-- CreateTable
CREATE TABLE IF NOT EXISTS "payment_record" (
  "id" SERIAL NOT NULL,
  "reference" VARCHAR(191) NOT NULL,
  "kind" VARCHAR(191) NOT NULL,
  "user_id" VARCHAR(191) NOT NULL,
  "target_ids_json" TEXT NOT NULL,
  "gateway_billing_id" VARCHAR(191),
  "checkout_url" TEXT,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "status" VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  "raw_response_json" TEXT,
  "raw_webhook_json" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payment_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "payment_record_reference_key" ON "payment_record"("reference");
CREATE UNIQUE INDEX IF NOT EXISTS "payment_record_gateway_billing_id_key" ON "payment_record"("gateway_billing_id");
CREATE INDEX IF NOT EXISTS "payment_record_gateway_billing_id_idx" ON "payment_record"("gateway_billing_id");
