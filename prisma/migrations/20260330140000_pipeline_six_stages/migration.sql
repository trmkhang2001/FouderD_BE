-- Replace LeadPipelineStage with 6 Ladipage-style stages + optional deal_amount

CREATE TYPE "LeadPipelineStage_new" AS ENUM (
  'NEW',
  'CONTACTED',
  'PERSUADING',
  'PAYMENT_SUCCESS',
  'ZALO_JOINED',
  'REFUND'
);

ALTER TABLE "leads" ALTER COLUMN "pipeline_stage" DROP DEFAULT;

ALTER TABLE "leads"
  ALTER COLUMN "pipeline_stage" TYPE "LeadPipelineStage_new"
  USING (
    CASE "pipeline_stage"::text
      WHEN 'NEW' THEN 'NEW'::"LeadPipelineStage_new"
      WHEN 'CONTACTED' THEN 'CONTACTED'::"LeadPipelineStage_new"
      WHEN 'PAID_97K' THEN 'PAYMENT_SUCCESS'::"LeadPipelineStage_new"
      WHEN 'DEPOSIT_YMM' THEN 'PAYMENT_SUCCESS'::"LeadPipelineStage_new"
      ELSE 'NEW'::"LeadPipelineStage_new"
    END
  );

ALTER TABLE "leads" ALTER COLUMN "pipeline_stage" SET DEFAULT 'NEW'::"LeadPipelineStage_new";

DROP TYPE "LeadPipelineStage";
ALTER TYPE "LeadPipelineStage_new" RENAME TO "LeadPipelineStage";

ALTER TABLE "leads" ADD COLUMN "deal_amount" DECIMAL(14,2);
