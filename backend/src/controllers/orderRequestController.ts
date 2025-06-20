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
          status: "PENDING",
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

export const getOrderRequests = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, categoryId, subcategoryId, sortBy = 'latest' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // 필터 조건 구성
    const where: any = {};
    if (categoryId) where.categoryId = Number(categoryId);
    if (subcategoryId) where.subcategoryId = Number(subcategoryId);
    
    // 정렬 조건 구성
    let orderBy: any = {};
    switch (sortBy) {
      case 'deadline':
        orderBy.deadline = 'asc';
        break;
      case 'points':
        orderBy.requiredPoints = 'desc';
        break;
      default:
        orderBy.createdAt = 'desc';
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
      orders: orders.map(order => ({
        ...order,
        buyer: { name: order.buyer.username },
        createdAt: order.createdAt.toISOString(),
        deadline: order.deadline.toISOString(),
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

export const getOrderRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.orderRequest.findUnique({
      where: { id },
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
      deadline: order.deadline.toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "주문 조회 실패" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 유효한 상태값인지 확인
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "유효하지 않은 상태값입니다." });
      return;
    }
    
    const updatedOrder = await prisma.orderRequest.update({
      where: { id },
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
        deadline: updatedOrder.deadline.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "주문 상태 변경 실패" });
  }
};

// 판매자 신청 생성
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { orderRequestId } = req.params;
    const { message, proposedPrice, estimatedDelivery } = req.body;
    
    const sellerId = req.user?.id;
    
    if (!sellerId) {
      res.status(401).json({ error: "판매자 인증이 필요합니다." });
      return;
    }

    // 이미 신청했는지 확인
    const existingApplication = await prisma.orderApplication.findFirst({
      where: {
        orderRequestId,
        sellerId,
      },
    });

    if (existingApplication) {
      res.status(400).json({ error: "이미 신청한 주문입니다." });
      return;
    }

    // 주문이 존재하고 PENDING 상태인지 확인
    const orderRequest = await prisma.orderRequest.findUnique({
      where: { id: orderRequestId },
    });

    if (!orderRequest) {
      res.status(404).json({ error: "주문을 찾을 수 없습니다." });
      return;
    }

    if (orderRequest.status !== 'PENDING') {
      res.status(400).json({ error: "신청 가능한 상태가 아닙니다." });
      return;
    }

    const application = await prisma.orderApplication.create({
      data: {
        orderRequestId,
        sellerId,
        message,
        proposedPrice: proposedPrice ? Number(proposedPrice) : null,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      },
      include: {
        seller: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "신청이 성공적으로 제출되었습니다.",
      application: {
        ...application,
        seller: { name: application.seller.username },
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
        estimatedDelivery: application.estimatedDelivery?.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "신청 제출 실패" });
  }
};

// 주문별 신청 목록 조회
export const getApplicationsByOrder = async (req: Request, res: Response) => {
  try {
    const { orderRequestId } = req.params;
    const { status } = req.query;

    const where: any = { orderRequestId };
    if (status) {
      where.status = status;
    }

    const applications = await prisma.orderApplication.findMany({
      where,
      include: {
        seller: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      applications: applications.map(app => ({
        ...app,
        seller: { name: app.seller.username },
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        estimatedDelivery: app.estimatedDelivery?.toISOString(),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "신청 목록 조회 실패" });
  }
};

// 신청 상태 변경 (구매자 또는 관리자만)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({ error: "인증이 필요합니다." });
      return;
    }

    // 유효한 상태값인지 확인
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "유효하지 않은 상태값입니다." });
      return;
    }

    const application = await prisma.orderApplication.findUnique({
      where: { id: applicationId },
      include: {
        orderRequest: {
          select: {
            buyerId: true,
          },
        },
      },
    });

    if (!application) {
      res.status(404).json({ error: "신청을 찾을 수 없습니다." });
      return;
    }

    // 권한 확인: 구매자 또는 관리자만 상태 변경 가능
    if (userRole !== 'admin' && application.orderRequest.buyerId !== userId) {
      res.status(403).json({ error: "상태 변경 권한이 없습니다." });
      return;
    }

    const updatedApplication = await prisma.orderApplication.update({
      where: { id: applicationId },
      data: { status },
      include: {
        seller: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "신청 상태가 성공적으로 변경되었습니다.",
      application: {
        ...updatedApplication,
        seller: { name: updatedApplication.seller.username },
        createdAt: updatedApplication.createdAt.toISOString(),
        updatedAt: updatedApplication.updatedAt.toISOString(),
        estimatedDelivery: updatedApplication.estimatedDelivery?.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "신청 상태 변경 실패" });
  }
};
