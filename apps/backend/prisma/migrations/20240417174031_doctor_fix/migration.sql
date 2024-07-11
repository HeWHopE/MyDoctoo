/*
  Warnings:

  - You are about to drop the column `availability` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "availability",
DROP COLUMN "rating";
