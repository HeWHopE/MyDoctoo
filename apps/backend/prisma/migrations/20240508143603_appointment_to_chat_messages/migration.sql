-- AlterTable
ALTER TABLE "chat_messages" ADD COLUMN     "appointment_id" TEXT,
ALTER COLUMN "text" DROP NOT NULL,
ALTER COLUMN "sender" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
