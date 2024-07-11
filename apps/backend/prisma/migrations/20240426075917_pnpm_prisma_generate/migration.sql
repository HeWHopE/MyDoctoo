-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "ended_at" TEXT,
ADD COLUMN     "started_at" TEXT,
ALTER COLUMN "payment_invoice_key" DROP NOT NULL,
ALTER COLUMN "payment_receipt_key" DROP NOT NULL;
