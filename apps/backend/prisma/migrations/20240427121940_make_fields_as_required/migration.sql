/*
  Warnings:

  - Made the column `ended_at` on table `appointments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `started_at` on table `appointments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "ended_at" SET NOT NULL,
ALTER COLUMN "started_at" SET NOT NULL;
