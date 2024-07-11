-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "ended_at" DROP NOT NULL,
ALTER COLUMN "started_at" DROP NOT NULL;
