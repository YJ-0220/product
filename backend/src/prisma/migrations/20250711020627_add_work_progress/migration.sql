-- CreateTable
CREATE TABLE "app"."WorkProgress" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "workItemId" TEXT NOT NULL,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "app"."WorkProgress" ADD CONSTRAINT "WorkProgress_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "app"."WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
