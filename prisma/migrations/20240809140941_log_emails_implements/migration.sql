-- CreateTable
CREATE TABLE "LogEmails" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "accepted" TEXT,
    "envelope" TEXT,
    "messageId" TEXT,
    "pending" TEXT,
    "rejected" TEXT,
    "response" TEXT,
    "userEmailTo" TEXT NOT NULL,

    CONSTRAINT "LogEmails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LogEmails" ADD CONSTRAINT "LogEmails_userEmailTo_fkey" FOREIGN KEY ("userEmailTo") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
