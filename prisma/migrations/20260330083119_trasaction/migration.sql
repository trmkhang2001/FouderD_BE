/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeadPipelineStage" AS ENUM ('NEW', 'CONTACTED', 'PAID_97K', 'DEPOSIT_YMM');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('AUTO', 'MANUAL', 'PENDING');

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pipeline_stage" "LeadPipelineStage" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transaction_id" TEXT NOT NULL,
ADD COLUMN     "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_id_key" ON "transactions"("transaction_id");
