/*
  Warnings:

  - Added the required column `product_name` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `product_name` VARCHAR(255);

UPDATE `OrderItem` SET `product_name` = (SELECT `name` FROM `Product` WHERE `Product`.`id` = `OrderItem`.`product_id`);

ALTER TABLE `OrderItem` MODIFY COLUMN `product_name` VARCHAR(255) NOT NULL;

