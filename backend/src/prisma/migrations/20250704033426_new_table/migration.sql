/*
  Warnings:

  - You are about to drop the column `bankName` on the `PointWithdrawRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bankId` to the `PointWithdrawRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app"."PointWithdrawRequest" DROP COLUMN "bankName",
ADD COLUMN     "bankId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "app"."Bank" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "accountNumLength" INTEGER NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_name_key" ON "app"."Bank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "app"."Category"("name");

-- AddForeignKey
ALTER TABLE "app"."PointWithdrawRequest" ADD CONSTRAINT "PointWithdrawRequest_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "app"."Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
