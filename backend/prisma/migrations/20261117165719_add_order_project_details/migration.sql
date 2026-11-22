/*
  Warnings:

  - A unique constraint covering the columns `[stripe_checkout_session_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_payment_intent_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "business_name" VARCHAR(150),
ADD COLUMN     "contact_email" VARCHAR(255),
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "inspiration" TEXT,
ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "seo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stripe_checkout_session_id" TEXT,
ADD COLUMN     "stripe_payment_intent_id" TEXT,
ADD COLUMN     "website_type" VARCHAR(30);

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_checkout_session_id_key" ON "orders"("stripe_checkout_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_payment_intent_id_key" ON "orders"("stripe_payment_intent_id");
