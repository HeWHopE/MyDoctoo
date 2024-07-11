/*
  Warnings:

  - You are about to drop the column `date` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_key` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `receipt_key` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `video_key` on the `appointments` table. All the data in the column will be lost.
  - The primary key for the `declarations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `declarations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `about_me` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `apartment` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `declaration_id` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the `chats_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chats_messages_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification_logs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[patient_id]` on the table `declarations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assigned_at` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_invoice_key` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_receipt_key` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `about` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adressId` to the `hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adressId` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Made the column `identity_card_key` on table `patients` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "chats_messages" DROP CONSTRAINT "chats_messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "chats_messages_attachments" DROP CONSTRAINT "chats_messages_attachments_chat_message_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_logs" DROP CONSTRAINT "notification_logs_patient_id_fkey";

-- DropIndex
DROP INDEX "declarations_patient_id_doctor_id_key";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "date",
DROP COLUMN "invoice_key",
DROP COLUMN "receipt_key",
DROP COLUMN "video_key",
ADD COLUMN     "assigned_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "payment_invoice_key" TEXT NOT NULL,
ADD COLUMN     "payment_receipt_key" TEXT NOT NULL,
ADD COLUMN     "video_record_key" TEXT;

-- AlterTable
ALTER TABLE "declarations" DROP CONSTRAINT "declarations_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "declarations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "about_me",
ADD COLUMN     "about" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "hospitals" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
DROP COLUMN "street",
ADD COLUMN     "adressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "apartment",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "declaration_id",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "zip_code",
ADD COLUMN     "adressId" TEXT NOT NULL,
ALTER COLUMN "identity_card_key" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email_verified" SET DEFAULT false;

-- DropTable
DROP TABLE "chats_messages";

-- DropTable
DROP TABLE "chats_messages_attachments";

-- DropTable
DROP TABLE "notification_logs";

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model" "NotificationModel" NOT NULL,
    "action" "NotificationAction" NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adresses" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "apartment" TEXT,
    "zip_code" INTEGER,

    CONSTRAINT "adresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "edited_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachments" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "attachment_key" TEXT NOT NULL,

    CONSTRAINT "message_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "declarations_patient_id_key" ON "declarations"("patient_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_adressId_fkey" FOREIGN KEY ("adressId") REFERENCES "adresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_adressId_fkey" FOREIGN KEY ("adressId") REFERENCES "adresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
