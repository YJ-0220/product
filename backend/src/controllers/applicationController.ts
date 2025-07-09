import { Request, Response } from "express";
import { prisma } from "../index";

// 판매자 주문 신청
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { orderRequestId } = req.params;
    const { message, proposedPrice, estimatedDelivery } = req.body;

    // 판매자 아이디 조회
    const sellerId = req.user?.id;

    // 이미 신청했는지 확인
    const existingApplication = await prisma.orderApplication.findFirst({
      where: {
        orderRequestId,
        sellerId: sellerId!,
      },
    });

    if (existingApplication) {
      res.status(400).json({ error: "이미 신청한 주문이 있습니다." });
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

    if (orderRequest.status !== "pending") {
      res.status(400).json({ error: "신청 가능한 상태가 아닙니다." });
      return;
    }

    // 신청서 생성
    const application = await prisma.orderApplication.create({
      data: {
        orderRequestId,
        sellerId: sellerId!,
        message,
        proposedPrice: proposedPrice ? Number(proposedPrice) : null,
        estimatedDelivery: estimatedDelivery
          ? new Date(estimatedDelivery)
          : null,
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

// 판매자 신청 수정
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { message, proposedPrice, estimatedDelivery } = req.body;

    const sellerId = req.user?.id;

    if (!sellerId) {
      res.status(401).json({ error: "판매자 인증이 필요합니다." });
      return;
    }

    // 신청 조회 및 권한 확인
    const application = await prisma.orderApplication.findUnique({
      where: { id: applicationId },
      include: {
        orderRequest: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!application) {
      res.status(404).json({ error: "신청을 찾을 수 없습니다." });
      return;
    }

    // 본인의 신청인지 확인
    if (application.sellerId !== sellerId) {
      res.status(403).json({ error: "자신의 신청만 수정할 수 있습니다." });
      return;
    }

    // PENDING 상태인 신청만 수정 가능
    if (application.status !== "pending") {
      res.status(400).json({ error: "대기중인 신청만 수정할 수 있습니다." });
      return;
    }

    // 주문이 PENDING 상태인지 확인
    if (application.orderRequest.status !== "pending") {
      res.status(400).json({ error: "신청 가능한 상태가 아닙니다." });
      return;
    }

    const updatedApplication = await prisma.orderApplication.update({
      where: { id: applicationId },
      data: {
        message,
        proposedPrice: proposedPrice ? Number(proposedPrice) : null,
        estimatedDelivery: estimatedDelivery
          ? new Date(estimatedDelivery)
          : null,
      },
      include: {
        seller: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "신청이 성공적으로 수정되었습니다.",
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
    res.status(500).json({ error: "신청 수정 실패" });
  }
};

// 판매자 신청 삭제
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;

    const sellerId = req.user?.id;

    const application = await prisma.orderApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      res.status(404).json({ error: "신청을 찾을 수 없습니다." });
      return;
    }

    if (application.sellerId !== sellerId) {
      res.status(403).json({ error: "자신의 신청만 삭제할 수 있습니다." });
      return;
    }

    await prisma.orderApplication.delete({
      where: { id: applicationId },
    });

    res.status(200).json({ message: "신청이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "신청 삭제 실패" });
  }
};

// 신청 상태 처리 및 주문 상태 변경 (관리자만 가능)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // 유효한 상태값인지 확인
    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "유효하지 않은 상태값입니다." });
      return;
    }

    const application = await prisma.orderApplication.findUnique({
      where: { id: applicationId },
      include: {
        orderRequest: {
          select: {
            id: true,
            buyerId: true,
            status: true,
          },
        },
      },
    });

    if (!application) {
      res.status(404).json({ error: "신청을 찾을 수 없습니다." });
      return;
    }

    // 트랜잭션으로 처리
    await prisma.$transaction(async (tx) => {
      // 신청 상태 업데이트
      const updatedApplication = await tx.orderApplication.update({
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

      // 신청이 수락되면 주문 상태를 "진행중"으로 변경
      if (
        status === "accepted" &&
        application.orderRequest.status === "pending"
      ) {
        // 주문 상태를 "진행중"으로 변경
        await tx.orderRequest.update({
          where: { id: application.orderRequest.id },
          data: { status: "progress" },
        });

        // 승인된 신청자 빼고 나머지 신청자는 거절 처리
        await tx.orderApplication.updateMany({
          where: {
            orderRequestId: application.orderRequest.id,
            status: "pending",
          },
          data: {
            status: "rejected",
          },
        });
      }

      return updatedApplication;
    });

    // 업데이트된 구매자 정보 조회
    const updatedApplication = await prisma.orderApplication.findUnique({
      where: { id: applicationId },
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
        seller: { name: updatedApplication!.seller.username },
        createdAt: updatedApplication!.createdAt.toISOString(),
        updatedAt: updatedApplication!.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "신청 상태 변경 실패" });
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
        createdAt: "desc",
      },
    });

    res.status(200).json({
      applications: applications.map((app) => ({
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

// 판매자의 승인된 신청서 조회
export const getAcceptedApplications = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;

    const acceptedApplications = await prisma.orderApplication.findMany({
      where: {
        sellerId,
        status: "accepted",
      },
      include: {
        orderRequest: {
          select: {
            id: true,
            title: true,
            description: true,
            requiredPoints: true,
            status: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json({
      applications: acceptedApplications.map((app) => ({
        ...app,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        estimatedDelivery: app.estimatedDelivery?.toISOString(),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "승인된 신청서 조회 실패" });
  }
};
