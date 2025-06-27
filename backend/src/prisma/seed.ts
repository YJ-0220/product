import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = "admin1234!";
  const buyerPassword = "test1234!";
  const sellerPassword = "test1234!";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedBuyerPassword = await bcrypt.hash(buyerPassword, 10);
  const hashedSellerPassword = await bcrypt.hash(sellerPassword, 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      password: hashedAdminPassword,
    },
    create: {
      username: "admin",
      password: hashedAdminPassword,
      role: "admin",
      membershipLevel: "vip",
    },
  });

  const buyer = await prisma.user.upsert({
    where: { username: "buyer" },
    update: { password: hashedBuyerPassword },
    create: {
      username: "test",
      password: hashedBuyerPassword,
      role: "buyer",
      membershipLevel: "bronze",
    },
  });

  const seller = await prisma.user.upsert({
    where: { username: "seller" },
    update: { password: hashedSellerPassword },
    create: {
      username: "stest",
      password: hashedSellerPassword,
      role: "seller",
    },
  });

  const categoryData = [
    {
      name: "유튜브",
      subcategories: ["영상홍보", "댓글", "채널 홍보", "채널 홍보 댓글"],
    },
    {
      name: "네이버",
      subcategories: [
        "블로그 홍보",
        "블로그 홍보 댓글",
        "카페 홍보",
        "카페 홍보 댓글",
      ],
    },
    {
      name: "인스타그램",
      subcategories: ["인스타그램 홍보", "인스타그램 홍보 댓글"],
    },
    {
      name: "X(트위터)",
      subcategories: ["X 홍보", "X 홍보 댓글"],
    },
  ];

  for (const { name, subcategories } of categoryData) {
    // 카테고리가 이미 존재하는지 확인
    let category = await prisma.category.findFirst({
      where: { name },
    });

    // 카테고리가 없으면 생성
    if (!category) {
      category = await prisma.category.create({ data: { name } });
    }

    // 기존 서브카테고리 삭제 후 새로 생성
    await prisma.subcategory.deleteMany({
      where: { parentId: category.id },
    });

    await prisma.subcategory.createMany({
      data: subcategories.map((subName) => ({
        name: subName,
        parentId: category!.id,
      })),
    });
  }

  console.log("시드 데이터가 성공적으로 생성되었습니다.");
  console.log("관리자 계정이 생성되었습니다:", admin.username);
  console.log("비밀번호:", adminPassword);
  console.log("구매자 계정이 생성되었습니다:", buyer.username);
  console.log("비밀번호:", buyerPassword);
  console.log("판매자 계정이 생성되었습니다:", seller.username);
  console.log("비밀번호:", sellerPassword);
  console.log("카테고리 데이터가 성공적으로 생성되었습니다.");
  console.log("서브카테고리 데이터가 성공적으로 생성되었습니다.");
  console.log("모든 데이터가 성공적으로 생성되었습니다.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
