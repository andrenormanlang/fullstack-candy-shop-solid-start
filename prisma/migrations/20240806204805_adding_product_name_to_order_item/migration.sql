/*
  Warnings:

  - You are about to alter the column `product_name` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `OrderItem` MODIFY `product_name` VARCHAR(191) NOT NULL;
