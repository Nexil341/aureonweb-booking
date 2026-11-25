-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "desired_deadline" DATE,
ADD COLUMN     "domain" VARCHAR(255),
ADD COLUMN     "materials" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "phone" VARCHAR(30);
