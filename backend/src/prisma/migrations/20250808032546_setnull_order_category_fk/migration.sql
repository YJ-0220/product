-- DropForeignKey
ALTER TABLE "app"."OrderRequest" DROP CONSTRAINT "OrderRequest_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "app"."OrderRequest" DROP CONSTRAINT "OrderRequest_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "app"."OrderRequest" ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "subcategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "app"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "app"."Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
