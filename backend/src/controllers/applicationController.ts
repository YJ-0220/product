import { Request, Response } from "express";
import { prisma } from "../index";

// 판매자 주문 신청
export const createOrderApplication = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      res.status(400).json({ error: "유효하지 않은 orderId입니다." });
      return;
    }
    const { message, proposedPrice, estimatedDelivery } = req.body;
    const sellerId = req.user!.id;

    const application = await prisma.$transaction(async (tx) => {
      const existingApplication = await tx.orderApplication.findFirst({
        where: {
          orderRequestId: orderId,
          sellerId,
        },
      });

      if (existingApplication) {
        throw new Error("이미 신청한 주문이 있습니다.");
      }

      const orderRequest = await tx.orderRequest.findUnique({
        where: { id: orderId },
      });

      if (!orderRequest) {
        throw new Error("주문을 찾을 수 없습니다.");
      }

      if (orderRequest.status !== "pending") {
        throw new Error("신청 가능한 상태가 아닙니다.");
      }

      const newApplication = await tx.orderApplication.create({
        data: {
          orderRequestId: orderId,
          sellerId,
          message,
          proposedPrice: proposedPrice ? Number(proposedPrice) : null,
          estimatedDelivery: estimatedDelivery
            ? new Date(estimatedDelivery)
            : null,
        },
        include: { seller: { select: { username: true } } },
      });
      return newApplication;
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
  } catch (error: any) {
    if (error.message === "이미 신청한 주문이 있습니다.") {
      res.status(400).json({ error: error.message });
      return;
    }
    if (error.message === "주문을 찾을 수 없습니다.") {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error.message === "신청 가능한 상태가 아닙니다.") {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "신청 제출 실패", details: error.message });
  }
};

// 판매자 신청 삭제
export const deleteOrderApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const sellerId = req.user!.id; // 미들웨어에서 무조건 보장
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
    res.status(500).json({ error: "신청 삭제 실패" });
  }
};

// 신청 상태 처리 및 주문 상태 변경 (관리자만 가능)
export const updateOrderApplicationStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
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
    await prisma.$transaction(async (tx) => {
      const updatedApplication = await tx.orderApplication.update({
        where: { id: applicationId },
        data: { status },
        include: { seller: { select: { username: true } } },
      });

      if (
        status === "accepted" &&
        application.orderRequest.status === "pending"
      ) {
        await tx.orderRequest.update({
          where: { id: application.orderRequest.id },
          data: { status: "progress" },
        });
        await tx.orderApplication.updateMany({
          where: {
            orderRequestId: application.orderRequest.id,
            status: "pending",
          },
          data: { status: "rejected" },
        });
      }
      return updatedApplication;
    });

    const updatedApplication = await prisma.orderApplication.findUnique({
      where: { id: applicationId },
      include: { seller: { select: { username: true } } },
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
    res.status(500).json({ error: "신청 상태 변경 실패" });
  }
};

// 주문별 신청 목록 조회
export const getOrderApplicationsByOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.params;
    const { status } = req.query;
    const where: any = { orderRequestId: orderId };
    if (status) {
      where.status = status;
    }
    const applications = await prisma.orderApplication.findMany({
      where,
      include: { seller: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
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
    res.status(500).json({ error: "신청 목록 조회 실패" });
  }
};

// 판매자의 승인된 신청서 목록 조회
export const getMyOrderApplications = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;

    const acceptedApplications = await prisma.orderApplication.findMany({
      where: {
        sellerId: sellerId,
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
            createdAt: true,
            buyer: { select: { username: true } },
          },
        },
        workItems: {
          select: {
            id: true,
            description: true,
            status: true,
            submittedAt: true,
            workLink: true,
            fileUrl: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json({
      applications: acceptedApplications.map((app) => ({
        ...app,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        estimatedDelivery: app.estimatedDelivery?.toISOString(),
        orderRequest: {
          ...app.orderRequest,
          createdAt: app.orderRequest.createdAt.toISOString(),
          buyer: { name: app.orderRequest.buyer.username },
        },
        workItems: app.workItems.map((item) => ({
          ...item,
          submittedAt: item.submittedAt?.toISOString(),
        })),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "승인된 신청서 목록 조회 실패" });
  }
};

// 관리자용 승인된 신청서 삭제
export const deleteAcceptedOrderApplication = async (
  req: Request,
  res: Response
) => {
  try {
    const { applicationId } = req.params;
    const application = await prisma.orderApplication.findUnique({
      where: { id: applicationId },
    });
    if (!application) {
      res.status(404).json({ error: "신청서를 찾을 수 없습니다." });
      return;
    }
    if (application.status !== "accepted") {
      res
        .status(400)
        .json({ error: "승인된(accepted) 신청서만 삭제할 수 있습니다." });
      return;
    }
    await prisma.orderApplication.delete({
      where: { id: applicationId },
    });
    res
      .status(200)
      .json({ message: "승인된 신청서가 성공적으로 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "신청서 삭제 실패" });
  }
};
