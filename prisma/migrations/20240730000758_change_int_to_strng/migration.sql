-- DropForeignKey
ALTER TABLE "log_logins" DROP CONSTRAINT "log_logins_userId_fkey";

-- AlterTable
ALTER TABLE "log_logins" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "log_logins" ADD CONSTRAINT "log_logins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;
