-- CreateTable
CREATE TABLE "external_pipeline_snapshots" (
    "id" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'LADIPAGE',
    "date" DATE NOT NULL,
    "payload_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_pipeline_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_pipeline_snapshots_sale_id_source_date_key" ON "external_pipeline_snapshots"("sale_id", "source", "date");

-- AddForeignKey
ALTER TABLE "external_pipeline_snapshots" ADD CONSTRAINT "external_pipeline_snapshots_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
