/*
  Warnings:

  - Added the required column `role` to the `assistant_messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssistantMessageRole" AS ENUM ('USER', 'ASSISTANT');

-- AlterTable
ALTER TABLE "assistant_messages" ADD COLUMN     "role" "AssistantMessageRole" NOT NULL;
