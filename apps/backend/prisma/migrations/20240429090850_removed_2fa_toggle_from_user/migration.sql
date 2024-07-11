/*
  Warnings:

  - You are about to drop the column `two_factor_auth_toggle` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "two_factor_auth_toggle" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "two_factor_auth_toggle";
