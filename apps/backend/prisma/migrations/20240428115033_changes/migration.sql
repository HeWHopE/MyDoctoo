-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "notes" DROP NOT NULL;
