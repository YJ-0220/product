/*
  Warnings:

  - A unique constraint covering the columns `[applicationId]` on the table `WorkItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkItem_applicationId_key" ON "app"."WorkItem"("applicationId");
