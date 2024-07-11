/*
  Warnings:

  - The `ended_at` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `started_at` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "ended_at",
ADD COLUMN     "ended_at" TIMESTAMPTZ,
DROP COLUMN "started_at",
ADD COLUMN     "started_at" TIMESTAMPTZ NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ;
