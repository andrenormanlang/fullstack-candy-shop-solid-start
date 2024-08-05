/*
  Warnings:

  - You are about to drop the column `created_at` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Order` table. All the data in the column will be lost.
  - Added the required column `order_number` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `order_date` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `order_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `order_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
