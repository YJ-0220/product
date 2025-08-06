-- DropForeignKey
ALTER TABLE "app"."WorkItem" DROP CONSTRAINT "WorkItem_applicationId_fkey";

-- AddForeignKey
ALTER TABLE "app"."WorkItem" ADD CONSTRAINT "WorkItem_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "app"."OrderApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
