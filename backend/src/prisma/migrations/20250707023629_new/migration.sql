-- CreateEnum
CREATE TYPE "app"."UserRole" AS ENUM ('buyer', 'seller', 'admin');

-- CreateEnum
CREATE TYPE "app"."MembershipLevel" AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'vip');

-- CreateEnum
CREATE TYPE "app"."PointTransactionType" AS ENUM ('charge', 'earn', 'spend', 'withdraw', 'admin_adjust');

-- CreateEnum
CREATE TYPE "app"."OrderStatus" AS ENUM ('pending', 'progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "app"."ApplicationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- CreateTable
CREATE TABLE "app"."User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "app"."UserRole" NOT NULL,
    "membership_level" "app"."MembershipLevel",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Point" (
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "app"."PointTransaction" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "type" "app"."PointTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "PointTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."PointChargeRequest" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "PointChargeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Bank" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "accountNumLength" INTEGER NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."PointWithdrawRequest" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "accountNum" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "PointWithdrawRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."OrderRequest" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "buyerId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "desiredQuantity" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3),
    "requiredPoints" INTEGER NOT NULL,
    "status" "app"."OrderStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."OrderApplication" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderRequestId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "message" TEXT,
    "proposedPrice" INTEGER,
    "estimatedDelivery" TIMESTAMP(3),
    "status" "app"."ApplicationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Subcategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "app"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_name_key" ON "app"."Bank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "app"."Category"("name");

-- AddForeignKey
ALTER TABLE "app"."Point" ADD CONSTRAINT "Point_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."PointTransaction" ADD CONSTRAINT "PointTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."PointChargeRequest" ADD CONSTRAINT "PointChargeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."PointWithdrawRequest" ADD CONSTRAINT "PointWithdrawRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."PointWithdrawRequest" ADD CONSTRAINT "PointWithdrawRequest_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "app"."Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "app"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "app"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "app"."Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderApplication" ADD CONSTRAINT "OrderApplication_orderRequestId_fkey" FOREIGN KEY ("orderRequestId") REFERENCES "app"."OrderRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderApplication" ADD CONSTRAINT "OrderApplication_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "app"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Subcategory" ADD CONSTRAINT "Subcategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "app"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
