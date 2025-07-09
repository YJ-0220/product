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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: "하위 카테고리 조회 실패" });
    return;
  }
};

// 주문하기 생성(구매자만 가능)
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
          deadline: deadline ? new Date(deadline) : null,
          requiredPoints,
          status: "pending",
        },
      });

      // 포인트 차감
      await tx.point.update({
        where: { userId: buyerId },
        data: { balance: { decrement: requiredPoints } },
      });

      // 포인트 거래 내역 기록 (사용 포인트)
      await tx.pointTransaction.create({
        data: {
          userId: buyerId,
          type: "spend",
          amount: -requiredPoints,
          description: `주문 요청: ${title}`,
        },
      });

      return { order, remainingPoint: pointRecord.balance - requiredPoints };
    });

    res.status(201).json({
      message: "주문 요청이 성공적으로 생성되었습니다.",
      orderRequestId: result.order.id,
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

// 작업 생성(판매자만 가능)
export const createWorkItem = async (req: Request, res: Response) => {
  try {
    const { orderRequestId, applicationId, description, fileUrl, workLink } =
      req.body;

    const workItem = await prisma.workItem.create({
      data: {
        orderRequestId,
        applicationId,
        description,
        fileUrl,
        workLink,
      },
    });

    res.status(201).json({ message: "작업 내역 생성 성공", workItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 내역 생성 실패" });
  }
};

// 작업 내역 조회(판매자는 작업물을 올려주고 구매자는 작업 현황 진행중인걸 보는것만 허용)
export const getOrderHistory = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const buyerId = req.user?.id;

    const myTasks = await prisma.orderApplication.findMany({
      where: {
        sellerId,
        status: "accepted",
      },
    });

    res.status(200).json(myTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 내역 조회 실패" });
  }
};

// 주문 목록 조회(주문 게시판용)
export const getOrderRequestBoard = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoryId,
      subcategoryId,
      sortBy = "latest",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // 필터 조건 구성
    const where: any = {};
    if (categoryId) where.categoryId = Number(categoryId);
    if (subcategoryId) where.subcategoryId = Number(subcategoryId);

    // 정렬 조건 구성
    let orderBy: any = {};
    switch (sortBy) {
      case "deadline":
        orderBy.deadline = "asc";
        break;
      case "points":
        orderBy.requiredPoints = "desc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    const [orders, total] = await Promise.all([
      prisma.orderRequest.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
        include: {
          buyer: {
            select: {
              username: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          subcategory: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.orderRequest.count({ where }),
    ]);

    res.status(200).json({
      orders: orders.map((order) => ({
        ...order,
        buyer: { name: order.buyer.username },
        createdAt: order.createdAt.toISOString(),
        deadline: order.deadline?.toISOString() || null,
      })),
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "주문 목록 조회 실패" });
  }
};

// 주문서 상세 조회(모든 사용자 가능)
export const getOrderRequestById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.orderRequest.findUnique({
      where: { id: orderId },
      include: {
        buyer: {
          select: {
            username: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: "주문을 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({
      ...order,
      buyer: { name: order.buyer.username },
      createdAt: order.createdAt.toISOString(),
      deadline: order.deadline?.toISOString() || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "주문 조회 실패" });
  }
};

// 주문 상태 변경(관리자만 가능)
export const updateOrderRequestStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // 유효한 상태값인지 확인
    const validStatuses = ["pending", "progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "유효하지 않은 상태값입니다." });
      return;
    }

    const updatedOrder = await prisma.orderRequest.update({
      where: { id: orderId },
      data: { status },
      include: {
        buyer: {
          select: {
            username: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "주문 상태가 성공적으로 변경되었습니다.",
      order: {
        ...updatedOrder,
        buyer: { name: updatedOrder.buyer.username },
        createdAt: updatedOrder.createdAt.toISOString(),
        deadline: updatedOrder.deadline?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "주문 상태 변경 실패" });
  }
};
