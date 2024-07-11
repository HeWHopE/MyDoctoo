/*
  Warnings:

  - You are about to drop the column `endsWorkHourUTC` on the `doctor_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startsWorkHourUTC` on the `doctor_schedules` table. All the data in the column will be lost.
  - Added the required column `ends_work_hour_utc` to the `doctor_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starts_work_hour_utc` to the `doctor_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor_schedules" DROP COLUMN "endsWorkHourUTC",
DROP COLUMN "startsWorkHourUTC",
ADD COLUMN     "ends_work_hour_utc" INTEGER NOT NULL,
ADD COLUMN     "starts_work_hour_utc" INTEGER NOT NULL;
