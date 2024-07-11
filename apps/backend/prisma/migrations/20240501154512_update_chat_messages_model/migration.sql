/*
  Warnings:

  - You are about to drop the column `sender_id` on the `chat_messages` table. All the data in the column will be lost.
  - Added the required column `sender` to the `chat_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "sender_id",
ADD COLUMN     "sender" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "missedMessagesDoctor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "missedMessagesPatient" INTEGER NOT NULL DEFAULT 0;
