/*
  Warnings:

  - Added the required column `active` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "active" BOOLEAN NOT NULL;
