/*
  Warnings:

  - You are about to drop the `WorkProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "app"."WorkProgress" DROP CONSTRAINT "WorkProgress_workItemId_fkey";

-- DropTable
DROP TABLE "app"."WorkProgress";
