-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "email_notification_toggle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "request_bill_payment_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_auth_toggle" BOOLEAN NOT NULL DEFAULT false;
