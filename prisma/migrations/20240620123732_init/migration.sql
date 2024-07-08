-- CreateEnum
CREATE TYPE "loginStatusE" AS ENUM ('Accept', 'Deny');

-- CreateEnum
CREATE TYPE "accountTypeE" AS ENUM ('TENANT', 'ADVISOR');

-- CreateEnum
CREATE TYPE "accountStatusE" AS ENUM ('Activated', 'Inactivated');

-- CreateEnum
CREATE TYPE "propertyTypeE" AS ENUM ('FLAT', 'HOUSE', 'SINGLEROOM', 'SHAREDROOM', 'DOUBLEROOM');

-- CreateEnum
CREATE TYPE "VerifyTokenType" AS ENUM ('ACTIVATION', 'RESET');

-- CreateEnum
CREATE TYPE "MessageStatusE" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "urlAvatar" TEXT,
    "description" TEXT,
    "mobile" TEXT NOT NULL,
    "address" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "county" TEXT,
    "country" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "loginAttempt" INTEGER NOT NULL,
    "accountStatus" "accountStatusE" NOT NULL,
    "accountType" "accountTypeE" NOT NULL,
    "acceptMarketing" BOOLEAN NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "passwordUpdatedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "propertyType" "propertyTypeE" NOT NULL,
    "rooms" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "toilets" INTEGER NOT NULL,
    "externalArea" BOOLEAN NOT NULL,
    "electricityFee" DECIMAL(65,30) NOT NULL,
    "wifiFee" DECIMAL(65,30) NOT NULL,
    "rubbishFee" DECIMAL(65,30) NOT NULL,
    "depositFee" DECIMAL(65,30) NOT NULL,
    "timeRefundDeposit" INTEGER NOT NULL,
    "availableAtInit" TIMESTAMP(3) NOT NULL,
    "availableAtEnd" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_logins" (
    "id" SERIAL NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "loginStatus" "loginStatusE" NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_logins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verify_tokens" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "VerifyTokenType" NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "verify_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "userIdFrom" INTEGER NOT NULL,
    "userIdTo" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatusE" NOT NULL,
    "seen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_publicId_key" ON "users"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "properties_publicId_key" ON "properties"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "property_images_publicId_key" ON "property_images"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "verify_tokens_publicId_key" ON "verify_tokens"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "verify_tokens_token_key" ON "verify_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "messages_publicId_key" ON "messages"("publicId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_logins" ADD CONSTRAINT "log_logins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verify_tokens" ADD CONSTRAINT "verify_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userIdFrom_fkey" FOREIGN KEY ("userIdFrom") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userIdTo_fkey" FOREIGN KEY ("userIdTo") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
