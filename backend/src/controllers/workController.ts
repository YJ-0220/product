import { Request, Response } from "express";
import { prisma } from "../index";

// 승인된 신청서에 대한 작업물 생성(판매자만 가능)
export const createWorkItem = async (req: Request, res: Response) => {
  try {
    const { orderRequestId, applicationId, description, fileUrl, workLink } =
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
        throw new Error("승인된 신청서만 작업물을 제출할 수 있습니다.");
      }

      if (application.sellerId !== sellerId) {
        throw new Error("자신의 신청서만 작업물을 제출할 수 있습니다.");
      }

      // 이미 작업물이 존재하는지 확인
      const existingWorkItem = await tx.workItem.findFirst({
        where: {
          orderRequestId,
          applicationId,
        },
      });

      if (existingWorkItem) {
        throw new Error("이미 작업물이 제출되었습니다.");
      }

      // 작업물 생성
      const newWorkItem = await tx.workItem.create({
        data: {
          orderRequestId,
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
    console.error(error);
    if (error.message === "신청서를 찾을 수 없습니다.") {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error.message === "승인된 신청서만 작업물을 제출할 수 있습니다.") {
      res.status(400).json({ error: error.message });
      return;
    }
    if (error.message === "자신의 신청서만 작업물을 제출할 수 있습니다.") {
      res.status(403).json({ error: error.message });
      return;
    }
    if (error.message === "이미 작업물이 제출되었습니다.") {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "작업 내역 생성 실패" });
  }
};

// 작업 진행 상황 생성 (판매자만 가능)
export const createWorkProgress = async (req: Request, res: Response) => {
  try {
    const {
      workItemId,
      progressPercent,
      status,
      title,
      description,
      imageUrls,
    } = req.body;

    const sellerId = req.user?.id;

    // WorkItem이 존재하고 해당 판매자의 것인지 확인
    const workItem = await prisma.workItem.findUnique({
      where: { id: workItemId },
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

    const workProgress = await prisma.workProgress.create({
      data: {
        workItemId,
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
    const { workItemId } = req.params;

    const workProgresses = await prisma.workProgress.findMany({
      where: { workItemId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ workProgresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 진행 상황 조회 실패" });
  }
};

// 작업 진행 상황 수정 (판매자만 가능)
export const updateWorkProgress = async (req: Request, res: Response) => {
  try {
    const { progressId } = req.params;
    const { progressPercent, status, title, description, imageUrls } = req.body;

    // 판매자 아이디 조회 (미들웨어에서 이미 확인됨)
    const sellerId = req.user?.id;

    // WorkProgress가 존재하고 해당 판매자의 것인지 확인
    const workProgress = await prisma.workProgress.findUnique({
      where: { id: progressId },
      include: {
        workItem: {
          include: {
            application: {
              select: { sellerId: true },
            },
          },
        },
      },
    });

    if (!workProgress) {
      res.status(404).json({ error: "작업 진행 상황을 찾을 수 없습니다." });
      return;
    }

    if (workProgress.workItem.application.sellerId !== sellerId) {
      res
        .status(403)
        .json({ error: "자신의 작업 진행 상황만 수정할 수 있습니다." });
      return;
    }

    const updatedWorkProgress = await prisma.workProgress.update({
      where: { id: progressId },
      data: {
        progressPercent: Number(progressPercent),
        status,
        title,
        description,
        imageUrls: imageUrls || [],
      },
    });

    res.status(200).json({
      message: "작업 진행 상황이 수정되었습니다.",
      workProgress: updatedWorkProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 진행 상황 수정 실패" });
  }
};

// 주문 ID로 WorkItem 조회
export const getWorkItemByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const workItem = await prisma.workItem.findUnique({
      where: { orderRequestId: orderId },
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
      res.status(404).json({ error: "작업물을 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({ workItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업물 조회 실패" });
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
