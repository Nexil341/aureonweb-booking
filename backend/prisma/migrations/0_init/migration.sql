-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "customer_name" VARCHAR(100) NOT NULL,
    "customer_email" VARCHAR(255) NOT NULL,
    "package" VARCHAR(50) NOT NULL,
    "hosting" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL,
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "order_status" VARCHAR(20) NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "orders"
ADD CONSTRAINT "orders_price_check"
CHECK ("price" > 0);
