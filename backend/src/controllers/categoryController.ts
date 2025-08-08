import { Request, Response } from "express";
import { prisma } from "../index";

// 카테고리 조회(구매자)
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

// 서브카테고리 조회(구매자)
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

// ===== 관리자용 카테고리/서브카테고리 관리 =====

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as { name?: string };
    if (!name || !name.trim()) {
      res.status(400).json({ error: "카테고리 이름은 필수입니다." });
      return;
    }
    const created = await prisma.category.create({
      data: { name: name.trim() },
    });
    res.status(201).json({ category: created });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "카테고리 생성 실패", details: error?.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const { name } = req.body as { name?: string };
    if (isNaN(categoryId)) {
      res.status(400).json({ error: "유효하지 않은 카테고리 ID입니다." });
      return;
    }
    if (!name || !name.trim()) {
      res.status(400).json({ error: "카테고리 이름은 필수입니다." });
      return;
    }
    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: { name: name.trim() },
    });
    res.status(200).json({ category: updated });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "카테고리 수정 실패", details: error?.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.categoryId);
    if (isNaN(categoryId)) {
      res.status(400).json({ error: "유효하지 않은 카테고리 ID입니다." });
      return;
    }

    await prisma.subcategory.deleteMany({ where: { parentId: categoryId } });
    await prisma.category.delete({ where: { id: categoryId } });

    res.status(200).json({ message: "카테고리가 삭제되었습니다." });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "카테고리 삭제 실패", details: error?.message });
  }
};

export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.categoryId);
    const { name } = req.body as { name?: string };

    if (isNaN(categoryId)) {
      res.status(400).json({ error: "유효하지 않은 카테고리 ID입니다." });
      return;
    }

    if (!name || !name.trim()) {
      res.status(400).json({ error: "서브카테고리 이름은 필수입니다." });
      return;
    }

    const sub = await prisma.subcategory.create({
      data: { parentId: categoryId, name: name.trim() },
    });

    res.status(201).json({ subcategory: sub });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "서브카테고리 생성 실패", details: error?.message });
  }
};

export const updateSubcategory = async (req: Request, res: Response) => {
  try {
    const subcategoryId = Number(req.params.subcategoryId);
    const { name } = req.body as { name?: string };

    if (isNaN(subcategoryId)) {
      res.status(400).json({ error: "유효하지 않은 서브카테고리 ID입니다." });
      return;
    }

    if (!name || !name.trim()) {
      res.status(400).json({ error: "서브카테고리 이름은 필수입니다." });
      return;
    }

    const updated = await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: { name: name.trim() },
    });

    res.status(200).json({ subcategory: updated });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "서브카테고리 수정 실패", details: error?.message });
  }
};

export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    const subcategoryId = Number(req.params.subcategoryId);

    if (isNaN(subcategoryId)) {
      res.status(400).json({ error: "유효하지 않은 서브카테고리 ID입니다." });
      return;
    }

    await prisma.subcategory.delete({
      where: { id: subcategoryId },
    });

    res.status(200).json({ message: "서브카테고리가 삭제되었습니다." });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "서브카테고리 삭제 실패", details: error?.message });
  }
};
