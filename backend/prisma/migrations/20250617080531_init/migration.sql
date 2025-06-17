-- CreateTable
CREATE TABLE "app"."user" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "membership_level" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."point" (
    "user_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "point_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "app"."orderRequest" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "buyerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "desiredQuantity" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "requiredPoints" INTEGER NOT NULL,

    CONSTRAINT "orderRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."category" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."subCategory" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "subCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "app"."user"("username");
