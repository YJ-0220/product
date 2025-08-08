-- AlterTable
ALTER TABLE "app"."Category" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "app"."Subcategory" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
