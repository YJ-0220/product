-- DropForeignKey
ALTER TABLE "app"."Notice" DROP CONSTRAINT "Notice_authorId_fkey";

-- DropForeignKey
ALTER TABLE "app"."OrderApplication" DROP CONSTRAINT "OrderApplication_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "app"."OrderRequest" DROP CONSTRAINT "OrderRequest_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "app"."PointChargeRequest" DROP CONSTRAINT "PointChargeRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "app"."PointTransaction" DROP CONSTRAINT "PointTransaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "app"."PointWithdrawRequest" DROP CONSTRAINT "PointWithdrawRequest_userId_fkey";

-- AddForeignKey
ALTER TABLE "app"."PointTransaction" ADD CONSTRAINT "PointTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."PointChargeRequest" ADD CONSTRAINT "PointChargeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."PointWithdrawRequest" ADD CONSTRAINT "PointWithdrawRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderApplication" ADD CONSTRAINT "OrderApplication_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Notice" ADD CONSTRAINT "Notice_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
