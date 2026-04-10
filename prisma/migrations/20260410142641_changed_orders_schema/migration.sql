-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('COD', 'ONLINE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'COD',
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT;
