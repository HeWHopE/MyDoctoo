-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DOCTOR', 'PATIENT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role";
