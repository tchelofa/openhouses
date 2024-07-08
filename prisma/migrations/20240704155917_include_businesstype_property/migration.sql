/*
  Warnings:

  - Added the required column `businessType` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('RENT', 'SELL');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "businessType" "BusinessType" NOT NULL;
