/*
  Warnings:

  - The values [TODO] on the enum `NotificationAction` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `appointment_price` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'MISSED';

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationAction_new" AS ENUM ('NEW_APPOINTMENT', 'CONFIRMED_APPOINTMENT', 'UPCOMING_APPOINTMENT', 'COMPLETED_APPOINTMENT', 'MISSED_APPOINTMENT', 'CANCELED_APPOINTMENT', 'FILE_RECEIVED', 'NEW_MESSAGE', 'INVOICE_RECEIVED', 'PAYMENT_SUCCESSFUL');
ALTER TABLE "notifications" ALTER COLUMN "action" TYPE "NotificationAction_new" USING ("action"::text::"NotificationAction_new");
ALTER TYPE "NotificationAction" RENAME TO "NotificationAction_old";
ALTER TYPE "NotificationAction_new" RENAME TO "NotificationAction";
DROP TYPE "NotificationAction_old";
COMMIT;

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "appointment_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "doctor_id" TEXT,
ADD COLUMN     "file_key" TEXT,
ADD COLUMN     "message" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
