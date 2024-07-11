/*
  Warnings:

  - You are about to drop the column `adressId` on the `hospitals` table. All the data in the column will be lost.
  - You are about to drop the column `adressId` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the `adresses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `hospitals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "hospitals" DROP CONSTRAINT "hospitals_adressId_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_adressId_fkey";

-- AlterTable
ALTER TABLE "hospitals" DROP COLUMN "adressId",
ADD COLUMN     "apartment" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zip_code" INTEGER;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "adressId",
ADD COLUMN     "apartment" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zip_code" INTEGER;

-- DropTable
DROP TABLE "adresses";