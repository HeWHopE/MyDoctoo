/*
  Warnings:

  - The primary key for the `declarations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `google_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patient_id,doctor_id]` on the table `chats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patient_id,doctor_id]` on the table `declarations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doctor_id,patient_id]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hospital_id,doctor_id]` on the table `hospital_doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patient_id` to the `declarations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_declaration_id_fkey";

-- AlterTable
ALTER TABLE "declarations" DROP CONSTRAINT "declarations_pkey",
ADD COLUMN     "patient_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "declarations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "declaration_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "google_id",
ADD COLUMN     "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "chats_patient_id_doctor_id_key" ON "chats"("patient_id", "doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "declarations_patient_id_doctor_id_key" ON "declarations"("patient_id", "doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_user_id_key" ON "doctors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_doctor_id_patient_id_key" ON "favorites"("doctor_id", "patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_doctors_hospital_id_doctor_id_key" ON "hospital_doctors"("hospital_id", "doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
