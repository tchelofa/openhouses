-- CreateTable
CREATE TABLE "FavoriteProperty" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavoriteProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteProperty_publicId_key" ON "FavoriteProperty"("publicId");

-- AddForeignKey
ALTER TABLE "FavoriteProperty" ADD CONSTRAINT "FavoriteProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteProperty" ADD CONSTRAINT "FavoriteProperty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;
