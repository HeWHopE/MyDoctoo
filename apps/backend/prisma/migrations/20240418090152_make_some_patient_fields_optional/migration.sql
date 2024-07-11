-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_declaration_id_fkey";

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "declaration_id" DROP NOT NULL,
ALTER COLUMN "identity_card_key" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_declaration_id_fkey" FOREIGN KEY ("declaration_id") REFERENCES "declarations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
