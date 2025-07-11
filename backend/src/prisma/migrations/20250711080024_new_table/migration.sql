/*
  Warnings:

  - The `status` column on the `WorkItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "app"."WorkStatus" AS ENUM ('submitted', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "app"."WorkItem" DROP COLUMN "status",
ADD COLUMN     "status" "app"."WorkStatus" NOT NULL DEFAULT 'submitted',
ALTER COLUMN "submittedAt" DROP DEFAULT;
