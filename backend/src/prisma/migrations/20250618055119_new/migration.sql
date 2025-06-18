-- CreateTable
CREATE TABLE "app"."User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "membership_level" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Point" (
    "userId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "balance" INTEGER NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("userId")
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
    "deadline" TIMESTAMP(3) NOT NULL,
    "requiredPoints" INTEGER NOT NULL,

    CONSTRAINT "OrderRequest_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "app"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "app"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."OrderRequest" ADD CONSTRAINT "OrderRequest_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "app"."Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Subcategory" ADD CONSTRAINT "Subcategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "app"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
