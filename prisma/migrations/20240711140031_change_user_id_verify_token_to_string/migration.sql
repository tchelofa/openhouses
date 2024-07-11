-- DropForeignKey
ALTER TABLE "verify_tokens" DROP CONSTRAINT "verify_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "verify_tokens" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "verify_tokens" ADD CONSTRAINT "verify_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;
