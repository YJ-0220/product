import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: '유튜브',
      subcategories: ['영상홍보', '댓글', '채널 홍보', '채널 홍보 댓글']
    },
    {
      name: '네이버',
      subcategories: ['블로그 홍보', '블로그 홍보 댓글', '카페 홍보', '카페 홍보 댓글']
    },
    {
      name: '인스타그램',
      subcategories: ['인스타그램 홍보', '인스타그램 홍보 댓글']
    },
    {
      name: 'X(트위터)',
      subcategories: ['X 홍보', 'X 홍보 댓글']
    }
  ];

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: { name: category.name }
    });

    await prisma.subcategory.createMany({
      data: category.subcategories.map(name => ({
        name,
        parentId: createdCategory.id
      }))
    });
  }

  console.log('시드 데이터가 성공적으로 생성되었습니다.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 