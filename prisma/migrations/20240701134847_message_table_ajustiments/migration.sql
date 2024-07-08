/*
  Warnings:

  - The values [DELIVERED] on the enum `MessageStatusE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deliveredAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `seen` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `userIdFrom` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `userIdTo` on the `messages` table. All the data in the column will be lost.
  - Added the required column `userFromId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userToId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageStatusE_new" AS ENUM ('SENT', 'READ');
ALTER TABLE "messages" ALTER COLUMN "status" TYPE "MessageStatusE_new" USING ("status"::text::"MessageStatusE_new");
ALTER TYPE "MessageStatusE" RENAME TO "MessageStatusE_old";
ALTER TYPE "MessageStatusE_new" RENAME TO "MessageStatusE";
DROP TYPE "MessageStatusE_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userIdFrom_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userIdTo_fkey";

-- DropIndex
DROP INDEX "messages_userIdFrom_userIdTo_idx";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "deliveredAt",
DROP COLUMN "readAt",
DROP COLUMN "seen",
DROP COLUMN "sentAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userIdFrom",
DROP COLUMN "userIdTo",
ADD COLUMN     "userFromId" TEXT NOT NULL,
ADD COLUMN     "userToId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userFromId_fkey" FOREIGN KEY ("userFromId") REFERENCES "users"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userToId_fkey" FOREIGN KEY ("userToId") REFERENCES "users"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;
