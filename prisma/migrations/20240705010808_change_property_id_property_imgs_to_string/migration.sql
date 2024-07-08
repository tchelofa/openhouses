-- DropForeignKey
ALTER TABLE "property_images" DROP CONSTRAINT "property_images_propertyId_fkey";

-- AlterTable
ALTER TABLE "property_images" ALTER COLUMN "propertyId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("publicId") ON DELETE CASCADE ON UPDATE CASCADE;
