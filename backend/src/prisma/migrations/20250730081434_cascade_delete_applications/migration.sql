/*
  Warnings:

  - Made the column `sellerId` on table `OrderApplication` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "app"."OrderApplication" DROP CONSTRAINT "OrderApplication_sellerId_fkey";

-- AlterTable
ALTER TABLE "app"."OrderApplication" ALTER COLUMN "sellerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "app"."OrderApplication" ADD CONSTRAINT "OrderApplication_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
