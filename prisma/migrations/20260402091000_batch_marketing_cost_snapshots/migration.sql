-- CreateTable
CREATE TABLE "batch_marketing_cost_snapshots" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'MARKETING_COSTS',
    "payload_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_marketing_cost_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batch_marketing_cost_snapshots_batch_id_source_key" ON "batch_marketing_cost_snapshots"("batch_id", "source");

-- AddForeignKey
ALTER TABLE "batch_marketing_cost_snapshots" ADD CONSTRAINT "batch_marketing_cost_snapshots_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "report_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

