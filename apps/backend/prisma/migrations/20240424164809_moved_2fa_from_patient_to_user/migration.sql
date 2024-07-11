/*
  Warnings:

  - You are about to drop the column `two_factor_auth_toggle` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "two_factor_auth_toggle";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "two_factor_auth_toggle" BOOLEAN NOT NULL DEFAULT false;
