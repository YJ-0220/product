import { Request, Response } from "express";
import { prisma } from "../index";

// 포인트 충전
export const chargePoint = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = req.user?.id;

  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400).json({
      message: "유효하지 않은 포인트 금액입니다.",
    });
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 포인트 조회
      const pointResult = await tx.point.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!pointResult) {
        await tx.point.create({
          data: {
            userId: userId!,
            balance: amount,
          },
        });
      } else {
        await tx.point.update({
          where: {
            userId: userId,
          },
          data: {
            balance: { increment: amount },
          },
        });
      }

      // 포인트 거래 내역 기록
      await tx.pointTransaction.create({
        data: {
          userId: userId!,
          amount,
          type: "admin_adjust",
          description: "오류 보상 포인트",
        },
      });

      const newBalanceResult = await tx.point.findUnique({
        where: {
          userId: userId,
        },
      });
      const newBalance = newBalanceResult?.balance;
      const formattedBalance = newBalance
        ? parseFloat(newBalance.toString()).toFixed(0)
        : 0;

      res.status(200).json({
        message: "포인트 충전이 완료되었습니다.",
        newBalance: formattedBalance,
      });
    });
  } catch (error) {
    console.error("포인트 충전 오류:", error);
    res.status(500).json({
      message: "포인트 충전에 실패했습니다.",
    });
  }
};

// 포인트 내역 조회
export const getPointHistory = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "인증이 필요합니다.",
    });
    return;
  }

  const pointHistory = await prisma.point.findMany({
    where: {
      userId: userId,
    },
  });

  res.status(200).json({
    pointHistory,
  });
};

// 포인트 충전 신청 생성
export const createPointChargeRequest = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = req.user?.id;

  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400).json({
      message: "유효하지 않은 포인트 금액입니다.",
    });
    return;
  }

  try {
    const chargeRequest = await prisma.pointChargeRequest.create({
      data: {
        userId: userId!,
        amount: amount,
        status: "pending",
      },
    });

    res.status(201).json({
      message: "포인트 충전 신청이 성공적으로 제출되었습니다.",
      requestId: chargeRequest.id,
    });
  } catch (error) {
    console.error("포인트 충전 신청 오류:", error);
    res.status(500).json({
      message: "포인트 충전 신청에 실패했습니다.",
    });
  }
};

// 사용자의 포인트 충전 신청 목록 조회
export const getPointChargeRequests = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const chargeRequests = await prisma.pointChargeRequest.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    res.status(200).json({
      chargeRequests: chargeRequests.map((request) => ({
        ...request,
        requestedAt: request.requestedAt.toISOString(),
        approvedAt: request.approvedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("포인트 충전 신청 목록 조회 오류:", error);
    res.status(500).json({
      message: "포인트 충전 신청 목록 조회에 실패했습니다.",
    });
  }
};

// 관리자용: 모든 포인트 충전 신청 목록 조회
export const getAllPointChargeRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const chargeRequests = await prisma.pointChargeRequest.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    res.status(200).json({
      chargeRequests: chargeRequests.map((request) => ({
        ...request,
        user: { name: request.user.username },
        requestedAt: request.requestedAt.toISOString(),
        approvedAt: request.approvedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("포인트 충전 신청 목록 조회 오류:", error);
    res.status(500).json({
      message: "포인트 충전 신청 목록 조회에 실패했습니다.",
    });
  }
};

// 관리자용: 포인트 충전 신청 승인/거절
export const updatePointChargeRequest = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { status } = req.body; // 'approved' 또는 'rejected'

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({
      message: "유효하지 않은 상태값입니다.",
    });
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 충전 신청 조회
      const chargeRequest = await tx.pointChargeRequest.findUnique({
        where: { id: requestId },
      });

      if (!chargeRequest) {
        throw new Error("충전 신청을 찾을 수 없습니다.");
      }

      if (chargeRequest.status !== "pending") {
        throw new Error("이미 처리된 신청입니다.");
      }

      // 신청 상태 업데이트
      await tx.pointChargeRequest.update({
        where: { id: requestId },
        data: {
          status: status,
          approvedAt: status === "approved" ? new Date() : null,
        },
      });

      // 승인된 경우 포인트 충전
      if (status === "approved") {
        const pointRecord = await tx.point.findUnique({
          where: { userId: chargeRequest.userId },
        });

        if (!pointRecord) {
          await tx.point.create({
            data: {
              userId: chargeRequest.userId,
              balance: chargeRequest.amount,
            },
          });
        } else {
          await tx.point.update({
            where: { userId: chargeRequest.userId },
            data: {
              balance: { increment: chargeRequest.amount },
            },
          });
        }

        // 포인트 거래 내역 기록
        await tx.pointTransaction.create({
          data: {
            userId: chargeRequest.userId,
            type: "charge",
            amount: chargeRequest.amount,
            description: "관리자 승인 포인트 충전",
          },
        });
      }
    });

    res.status(200).json({
      message: `포인트 충전 신청이 ${
        status === "approved" ? "승인" : "거절"
      }되었습니다.`,
    });
  } catch (error: any) {
    console.error("포인트 충전 신청 처리 오류:", error);
    res.status(500).json({
      message: error.message || "포인트 충전 신청 처리에 실패했습니다.",
    });
  }
};

// 사용자별 포인트 거래 내역 조회
export const getUserPointHistory = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const pointHistory = await prisma.pointTransaction.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      pointHistory: pointHistory.map((transaction) => ({
        ...transaction,
        createdAt: transaction.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("포인트 거래 내역 조회 오류:", error);
    res.status(500).json({
      message: "포인트 거래 내역 조회에 실패했습니다.",
    });
  }
};

// 포인트 환전 신청 생성
export const createPointWithdrawRequest = async (req: Request, res: Response) => {
  const { amount, bankName, accountNum } = req.body;
  const userId = req.user?.id;

  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400).json({
      message: "유효하지 않은 포인트 금액입니다.",
    });
    return;
  }

  if (!bankName || !accountNum) {
    res.status(400).json({
      message: "은행명과 계좌번호를 입력해주세요.",
    });
    return;
  }

  try {
    // 현재 포인트 잔액 확인
    const pointRecord = await prisma.point.findUnique({
      where: { userId: userId },
    });

    if (!pointRecord || pointRecord.balance < amount) {
      res.status(400).json({
        message: "포인트가 부족합니다.",
      });
      return;
    }

    const withdrawRequest = await prisma.pointWithdrawRequest.create({
      data: {
        userId: userId!,
        amount: amount,
        bankName: bankName,
        accountNum: accountNum,
        status: "pending",
      },
    });

    res.status(201).json({
      message: "포인트 환전 신청이 성공적으로 제출되었습니다.",
      requestId: withdrawRequest.id,
    });
  } catch (error) {
    console.error("포인트 환전 신청 오류:", error);
    res.status(500).json({
      message: "포인트 환전 신청에 실패했습니다.",
    });
  }
};

// 사용자의 포인트 환전 신청 목록 조회
export const getPointWithdrawRequests = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const withdrawRequests = await prisma.pointWithdrawRequest.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    res.status(200).json({
      withdrawRequests: withdrawRequests.map((request) => ({
        ...request,
        requestedAt: request.requestedAt.toISOString(),
        processedAt: request.processedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("포인트 환전 신청 목록 조회 오류:", error);
    res.status(500).json({
      message: "포인트 환전 신청 목록 조회에 실패했습니다.",
    });
  }
};
