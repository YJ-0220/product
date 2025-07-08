/*
  Warnings:

  - The values [cancelled] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "app"."ApplicationStatus_new" AS ENUM ('pending', 'accepted', 'rejected');
ALTER TABLE "app"."OrderApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "app"."OrderApplication" ALTER COLUMN "status" TYPE "app"."ApplicationStatus_new" USING ("status"::text::"app"."ApplicationStatus_new");
ALTER TYPE "app"."ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "app"."ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "app"."ApplicationStatus_old";
ALTER TABLE "app"."OrderApplication" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- CreateTable
CREATE TABLE "app"."WorkItem" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "orderRequestId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fileUrl" TEXT,
    "workLink" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "submittedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkItem_orderRequestId_key" ON "app"."WorkItem"("orderRequestId");

-- AddForeignKey
ALTER TABLE "app"."WorkItem" ADD CONSTRAINT "WorkItem_orderRequestId_fkey" FOREIGN KEY ("orderRequestId") REFERENCES "app"."OrderRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."WorkItem" ADD CONSTRAINT "WorkItem_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "app"."OrderApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
