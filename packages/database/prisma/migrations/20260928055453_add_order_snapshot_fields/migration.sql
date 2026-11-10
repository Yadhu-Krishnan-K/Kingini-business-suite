/*
  Warnings:

  - Added the required column `shippingAddressLine1` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingFullName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPostalCode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingState` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shippingAddressLine1" TEXT NOT NULL,
ADD COLUMN     "shippingAddressLine2" TEXT,
ADD COLUMN     "shippingCity" TEXT NOT NULL,
ADD COLUMN     "shippingCountry" TEXT NOT NULL,
ADD COLUMN     "shippingFullName" TEXT NOT NULL,
ADD COLUMN     "shippingPhone" TEXT NOT NULL,
ADD COLUMN     "shippingPostalCode" TEXT NOT NULL,
ADD COLUMN     "shippingState" TEXT NOT NULL,
ADD COLUMN     "subtotalAmount" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL;
