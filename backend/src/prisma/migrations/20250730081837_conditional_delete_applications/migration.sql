-- DropForeignKey
ALTER TABLE "app"."OrderApplication" DROP CONSTRAINT "OrderApplication_sellerId_fkey";

-- AlterTable
ALTER TABLE "app"."OrderApplication" ALTER COLUMN "sellerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "app"."OrderApplication" ADD CONSTRAINT "OrderApplication_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
