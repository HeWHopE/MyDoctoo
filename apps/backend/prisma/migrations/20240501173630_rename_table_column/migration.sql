/*
  Warnings:

  - You are about to drop the column `assigned_at` on the `appointments` table. All the data in the column will be lost.
  - Made the column `started_at` on table `appointments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "assigned_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "started_at" SET NOT NULL;
