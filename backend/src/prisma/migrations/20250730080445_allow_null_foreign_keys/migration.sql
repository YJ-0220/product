-- DropForeignKey
ALTER TABLE "app"."Point" DROP CONSTRAINT "Point_userId_fkey";

-- AlterTable
ALTER TABLE "app"."Notice" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "app"."OrderApplication" ALTER COLUMN "sellerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "app"."OrderRequest" ALTER COLUMN "buyerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "app"."PointChargeRequest" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "app"."PointTransaction" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "app"."PointWithdrawRequest" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "app"."Point" ADD CONSTRAINT "Point_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
