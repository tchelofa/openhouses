-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "messages_userIdFrom_userIdTo_idx" ON "messages"("userIdFrom", "userIdTo");
