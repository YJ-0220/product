import { Request, Response } from "express";
import { prisma } from "../index";

// 카테고리 조회(구매자만 조회 가능)
export const getOrderCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      distinct: ["name"],
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "카테고리 조회 실패" });
  }
};

// 서브카테고리 조회(구매자만 조회 가능)
export const getOrderSubCategories = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);
  try {
    if (isNaN(categoryId)) {
      res.status(400).json({ error: "유효하지 않은 카테고리 ID입니다." });
      return;
    }

    const subcategories = await prisma.subcategory.findMany({
      where: {
        parentId: categoryId,
      },
    });
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: "하위 카테고리 조회 실패" });
    return;
  }
};
