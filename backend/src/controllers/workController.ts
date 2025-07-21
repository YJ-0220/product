import { Request, Response } from "express";
import { prisma } from "../index";

// 승인된 신청서에 대한 작업물 생성(판매자만 가능)
export const createWorkSubmit = async (req: Request, res: Response) => {
  try {
    const { orderId, applicationId, description, fileUrl, workLink } =
      req.body;

    const sellerId = req.user?.id;

    // 트랜잭션으로 처리
    const workItem = await prisma.$transaction(async (tx) => {
      // 신청서가 존재하고 승인되었는지 확인
      const application = await tx.orderApplication.findUnique({
        where: { id: applicationId },
        include: {
          orderRequest: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!application) {
        throw new Error("신청서를 찾을 수 없습니다.");
      }

      if (application.status !== "accepted") {
        throw new Error("신청이 승인된 주문에만 작업물을 제출할 수 있습니다.");
      }

      if (application.sellerId !== sellerId) {
        throw new Error("신청을 한 판매자만 작업물을 제출할 수 있습니다.");
      }

      // 이미 작업물이 존재하는지 확인
      const existingWorkItem = await tx.workItem.findFirst({
        where: {
          orderRequestId: orderId,
          applicationId,
        },
      });

      if (existingWorkItem) {
        throw new Error("이미 작업물이 제출되었습니다.");
      }

      // 작업물 생성
      const newWorkItem = await tx.workItem.create({
        data: {
          orderRequestId: orderId,
          applicationId,
          description,
          fileUrl,
          workLink,
        },
      });

      return newWorkItem;
    });

    res.status(201).json({ message: "작업 내역 생성 성공", workItem });
  } catch (error: any) {
    res.status(500).json({ error: "작업 내역 생성 실패" });
  }
};

// 작업물 수정 (판매자만 가능)
export const updateWorkItem = async (req: Request, res: Response) => {
  try {
    const { orderId, applicationId } = req.params;
    const { description, fileUrl, workLink } = req.body;

    const sellerId = req.user?.id;

    const workItem = await prisma.workItem.findFirst({
      where: {
        orderRequestId: orderId,
        applicationId,
      },
      include: {
        application: {
          select: { sellerId: true },
        },
      },
    });

    if (!workItem) {
      res.status(404).json({ error: "작업물을 찾을 수 없습니다." });
      return;
    }

    if (workItem.application.sellerId !== sellerId) {
      res
        .status(403)
        .json({ error: "자신의 작업물만 업데이트할 수 있습니다." });
      return;
    }

    const updatedWorkItem = await prisma.workItem.update({
      where: { id: workItem.id },
      data: { description, fileUrl, workLink },
    });

    res
      .status(200)
      .json({
        message: "작업물이 업데이트되었습니다.",
        workItem: updatedWorkItem,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업물 업데이트 실패" });
  }
};

// 작업 진행 상황 생성 (판매자만 가능)
export const createWorkProgress = async (req: Request, res: Response) => {
  try {
    const { orderId, applicationId } = req.params;
    const {
      progressPercent,
      status,
      title,
      description,
      imageUrls,
    } = req.body;

    const sellerId = req.user?.id;

    // WorkItem이 존재하는지 확인 (없으면 생성)
    let workItem = await prisma.workItem.findFirst({
      where: { 
        orderRequestId: orderId,
        applicationId: applicationId
      },
      include: {
        application: {
          select: { sellerId: true },
        },
      },
    });

    // 작업물이 없으면 자동으로 생성
    if (!workItem) {
      // 신청서가 존재하고 승인되었는지 확인
      const application = await prisma.orderApplication.findUnique({
        where: { id: applicationId },
        include: {
          orderRequest: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!application) {
        res.status(404).json({ error: "신청서를 찾을 수 없습니다." });
        return;
      }

      if (application.status !== "accepted") {
        res.status(400).json({ error: "신청이 승인된 주문에만 진행상황을 추가할 수 있습니다." });
        return;
      }

      if (application.sellerId !== sellerId) {
        res.status(403).json({ error: "신청을 한 판매자만 진행상황을 추가할 수 있습니다." });
        return;
      }

      // 작업물 자동 생성
      workItem = await prisma.workItem.create({
        data: {
          orderRequestId: orderId,
          applicationId: applicationId,
          description: "자동 생성된 작업물",
        },
        include: {
          application: {
            select: { sellerId: true },
          },
        },
      });
    } else {
      // 기존 작업물의 소유자 확인
      if (workItem.application.sellerId !== sellerId) {
        res.status(403).json({ error: "자신의 작업물만 업데이트할 수 있습니다." });
        return;
      }
    }

    const workProgress = await prisma.workProgress.create({
      data: {
        workItemId: workItem.id,
        progressPercent: Number(progressPercent),
        status,
        title,
        description,
        imageUrls: imageUrls || [],
      },
    });

    res.status(201).json({
      message: "작업 진행 상황이 업데이트되었습니다.",
      workProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 진행 상황 업데이트 실패" });
  }
};

// 작업 진행 상황 조회 (구매자, 판매자, 관리자)
export const getWorkProgress = async (req: Request, res: Response) => {
  try {
    const { orderId, applicationId } = req.params;

    // WorkItem 조회 (선택사항)
    const workItem = await prisma.workItem.findFirst({
      where: { 
        orderRequestId: orderId,
        applicationId
      },
    });

    // 작업물이 없어도 진행상황은 조회 가능하도록 수정
    let workProgresses: any[] = [];
    
    if (workItem) {
      // 작업물이 있으면 해당 작업물의 진행상황 조회
      workProgresses = await prisma.workProgress.findMany({
        where: { workItemId: workItem.id },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // 작업물이 없으면 빈 배열 반환 (오류가 아님)
      workProgresses = [];
    }

    res.status(200).json({ workProgresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 진행 상황 조회 실패" });
  }
};

// 작업 진행 상황 수정 (판매자만 가능)
export const updateWorkProgress = async (req: Request, res: Response) => {
  try {
    const { orderId, applicationId, progressId } = req.params;
    const {
      progressPercent,
      status,
      title,
      description,
      imageUrls,
    } = req.body;

    const sellerId = req.user?.id;

    // WorkItem이 존재하는지 확인
    const workItem = await prisma.workItem.findFirst({
      where: { 
        orderRequestId: orderId,
        applicationId: applicationId
      },
      include: {
        application: {
          select: { sellerId: true },
        },
      },
    });

    if (!workItem) {
      res.status(404).json({ error: "작업물을 찾을 수 없습니다." });
      return;
    }

    // 작업물 소유자 확인
    if (workItem.application.sellerId !== sellerId) {
      res.status(403).json({ error: "자신의 작업물만 수정할 수 있습니다." });
      return;
    }

    // 진행 상황이 존재하는지 확인
    const existingProgress = await prisma.workProgress.findFirst({
      where: { 
        id: progressId,
        workItemId: workItem.id
      },
    });

    if (!existingProgress) {
      res.status(404).json({ error: "진행 상황을 찾을 수 없습니다." });
      return;
    }

    // 진행 상황 업데이트
    const updatedProgress = await prisma.workProgress.update({
      where: { id: progressId },
      data: {
        progressPercent: Number(progressPercent),
        status,
        title,
        description,
        imageUrls: imageUrls || existingProgress.imageUrls,
      },
    });

    res.status(200).json({
      message: "작업 진행 상황이 수정되었습니다.",
      workProgress: updatedProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 진행 상황 수정 실패" });
  }
};

// 주문 ID와 신청서 ID로 WorkItem 조회
export const getWorkItemByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId, applicationId } = req.params;

    const workItem = await prisma.workItem.findFirst({
      where: { 
        orderRequestId: orderId,
        applicationId: applicationId
      },
      include: {
        application: {
          include: {
            seller: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!workItem) {
      res.status(404).json({ error: "진행중인 작업이 없습니다." });
      return;
    }

    res.status(200).json({ workItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업물 조회 실패" });
  }
};

// 작업물 상태 업데이트 (구매자만 가능)
export const updateWorkItemStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, applicationId } = req.params;
    const { status } = req.body;
    const buyerId = req.user?.id;

    // 주문서가 존재하고 구매자의 것인지 확인
    const orderRequest = await prisma.orderRequest.findUnique({
      where: { id: orderId },
      select: { buyerId: true },
    });

    if (!orderRequest) {
      res.status(404).json({ error: "주문서를 찾을 수 없습니다." });
      return;
    }

    if (orderRequest.buyerId !== buyerId) {
      res.status(403).json({ error: "자신의 주문서만 작업물 상태를 변경할 수 있습니다." });
      return;
    }

    // 작업물 상태 업데이트
    const updatedWorkItem = await prisma.workItem.updateMany({
      where: {
        orderRequestId: orderId,
        applicationId: applicationId,
      },
      data: {
        status: status,
      },
    });

    res.status(200).json({
      message: "작업물 상태가 업데이트되었습니다.",
      workItem: updatedWorkItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업물 상태 업데이트 실패" });
  }
};

// 작업 목록 조회 (구매자/판매자 역할에 따라 다른 데이터)
export const getWorkItems = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    let workItems;

    if (userRole === "seller") {
      // 판매자: 내가 승인받은 작업물 목록
      workItems = await prisma.workItem.findMany({
        where: {
          application: {
            sellerId: userId,
            status: "accepted",
          },
        },
        include: {
          orderRequest: {
            select: {
              id: true,
              title: true,
              description: true,
              requiredPoints: true,
              status: true,
              createdAt: true,
              buyer: {
                select: {
                  username: true,
                },
              },
            },
          },
          application: {
            select: {
              id: true,
              message: true,
              proposedPrice: true,
              estimatedDelivery: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });

      res.status(200).json({
        workItems: workItems.map((item) => ({
          ...item,
          submittedAt: item.submittedAt?.toISOString(),
          orderRequest: {
            ...item.orderRequest,
            createdAt: item.orderRequest.createdAt.toISOString(),
            buyer: { name: item.orderRequest.buyer.username },
          },
          application: {
            ...item.application,
            createdAt: item.application.createdAt.toISOString(),
          },
        })),
      });
    } else if (userRole === "buyer") {
      // 구매자: 내가 주문한 작업물 목록
      workItems = await prisma.workItem.findMany({
        where: {
          orderRequest: {
            buyerId: userId,
          },
        },
        include: {
          orderRequest: {
            select: {
              id: true,
              title: true,
              description: true,
              requiredPoints: true,
              status: true,
              createdAt: true,
            },
          },
          application: {
            select: {
              id: true,
              message: true,
              proposedPrice: true,
              estimatedDelivery: true,
              createdAt: true,
              seller: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });

      res.status(200).json({
        workItems: workItems.map((item) => ({
          ...item,
          submittedAt: item.submittedAt?.toISOString(),
          orderRequest: {
            ...item.orderRequest,
            createdAt: item.orderRequest.createdAt.toISOString(),
          },
          application: {
            ...item.application,
            createdAt: item.application.createdAt.toISOString(),
            seller: { name: item.application.seller.username },
          },
        })),
      });
    } else {
      res.status(403).json({ error: "접근 권한이 없습니다." });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 목록 조회 실패" });
  }
};
