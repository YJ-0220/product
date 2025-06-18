import { Request, Response } from "express";
import { prisma } from "../index";

export const createOrderRequest = async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      subcategoryId,
      title,
      description,
      desiredQuantity,
      requiredPoints,
      deadline,
    } = req.body;

    // 현재 로그인한 사용자의 ID
    const buyerId = req.user?.id;

    if (!buyerId) {
      res.status(401).json({ message: "구매자 인증이 필요합니다." });
      return;
    }

    // 트랜잭션으로 처리
    const result = await prisma.$transaction(async (tx) => {
      // 현재 포인트 조회
      const pointRecord = await tx.point.findUnique({
        where: { userId: buyerId },
      });

      if (!pointRecord || pointRecord.balance < requiredPoints) {
        throw new Error("포인트가 부족합니다.");
      }

      // 주문 요청 생성
      const order = await tx.orderRequest.create({
        data: {
          buyerId: buyerId,
          categoryId,
          subcategoryId,
          title,
          description,
          desiredQuantity,
          deadline: new Date(deadline),
          requiredPoints,
        },
      });

      // 포인트 차감
      await tx.point.update({
        where: { userId: buyerId },
        data: { balance: { decrement: requiredPoints } },
      });

      return { order, remainingPoint: pointRecord.balance - requiredPoints };
    });

    res.status(201).json({
      message: "주문 요청이 성공적으로 생성되었습니다.",
      order: result.order,
      remainingPoint: result.remainingPoint,
    });
  } catch (error: any) {
    console.error(error);
    if (error.message === "포인트가 부족합니다.") {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "주문 요청 오류가 발생했습니다.", error });
    return;
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "카테고리 조회 실패" });
  }
};

export const getSubCategories = async (req: Request, res: Response) => {
  const parentId = Number(req.params.parentId);
  try {
    if (isNaN(parentId)) {
      res.status(400).json({ error: "유효하지 않은 카테고리 ID입니다." });
      return;
    }

    const subcategories = await prisma.subcategory.findMany({
      where: {
        parentId: parentId,
      },
    });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "하위 카테고리 조회 실패" });
    return;
  }
};
