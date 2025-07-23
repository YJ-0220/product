import { Request, Response } from "express";
import { prisma } from "../index";

// 신청이 승인된 주문서에 대한 작업물 생성(판매자)
export const createOrderWorkSubmit = async (req: Request, res: Response) => {
  try {
    const { orderId, description, fileUrl, workLink } = req.body;

    const sellerId = req.user?.id;

    // 트랜잭션으로 처리
    const workItem = await prisma.$transaction(async (tx) => {
      // 신청서가 존재하고 승인되었는지 확인
      const application = await tx.orderApplication.findFirst({
        where: {
          orderRequestId: orderId,
          sellerId: sellerId,
          status: "accepted",
        },
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

      // 이미 작업물이 존재하는지 확인
      const existingWorkItem = await tx.workItem.findFirst({
        where: {
          orderRequestId: orderId,
          applicationId: application.id,
        },
      });

      if (existingWorkItem) {
        throw new Error("이미 작업물이 제출되었습니다.");
      }

      // 작업물 생성
      const newWorkItem = await tx.workItem.create({
        data: {
          orderRequestId: orderId,
          applicationId: application.id,
          description,
          fileUrl,
          workLink,
        },
      });

      return newWorkItem;
    });

    res.status(201).json({ message: "작업물 제출 성공", workItem });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "작업물 제출 실패" });
  }
};

// 작업 게시판 조회(판매자)
export const getOrderWorkList = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;

    // 신청이 승인된 주문서 조회
    const applications = await prisma.orderApplication.findMany({
      where: {
        sellerId,
        status: "accepted",
      },
      include: {
        workItems: true,
        orderRequest: true,
      },
    });

    res.status(200).json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업 목록 조회 실패" });
  }
};


// 작업물 상세 조회(판매자)
export const getOrderWorkItem = async (req: Request, res: Response) => {
  try {
    // 판매자 작업물 상세 조회
    const { workItemId } = req.params;

    // 작업물 상세 조회 (해당 신청서의 작업물인지 확인)
    const workItem = await prisma.workItem.findFirst({
      where: {
        id: workItemId,
      },
      include: {
        application: {
          include: {
            seller: {
              select: { username: true },
            },
            orderRequest: {
              select: {
                id: true,
                title: true,
                category: {
                  select: { name: true },
                },
                subcategory: {
                  select: { name: true },
                },
                description: true,
                requiredPoints: true,
                status: true,
                createdAt: true,
                buyer: {
                  select: { username: true },
                },
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
    res.status(500).json({ error: "작업물 상세 조회 실패" });
  }
};

// 작업물 수정 (판매자)
export const updateOrderWorkItem = async (req: Request, res: Response) => {
  try {
    const { orderId, workItemId } = req.params;
    const { description, fileUrl, workLink } = req.body;

    const sellerId = req.user?.id;

    const workItem = await prisma.workItem.findFirst({
      where: {
        id: workItemId,
        application: {
          orderRequestId: orderId,
          sellerId: sellerId,
        },
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
      where: { id: workItemId },
      data: { description, fileUrl, workLink },
    });

    res.status(200).json({
      message: "작업물이 업데이트되었습니다.",
      workItem: updatedWorkItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "작업물 업데이트 실패" });
  }
};

// 작업물 상태 업데이트 (관리자만 가능)
export const updateOrderWorkItemStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId, workItemId } = req.params;
    const { status } = req.body;

    const validStatuses = ["submitted", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "유효하지 않은 상태값입니다." });
    }

    // 작업물이 존재하는지
    const workItem = await prisma.workItem.findUnique({
      where: { id: workItemId },
      include: {
        orderRequest: {
          select: {
            id: true,
          },
        },
        application: {
          select: { sellerId: true },
        },
      },
    });

    if (!workItem || workItem.orderRequestId !== orderId) {
      res.status(404).json({ error: "작업물을 찾을 수 없습니다." });
      return;
    }

    // 작업물 상태 업데이트
    const updatedWorkItem = await prisma.workItem.update({
      where: {
        id: workItemId,
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
