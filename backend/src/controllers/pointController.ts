import { Request, Response } from "express";
import { prisma } from "../index";

// 관리자 본인용 포인트 즉시 충전
export const adminChargePoint = async (req: Request, res: Response) => {
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

// 관리자용 포인트 충전 (사용자에게 직접 충전)
export const adminChargeUserPoint = async (req: Request, res: Response) => {
  const { amount, description } = req.body;
  const { username } = req.params;
  const userId = req.user?.id;

  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400).json({
      message: "유효하지 않은 포인트 금액입니다.",
    });
    return;
  }

  try {
    // 사용자 존재 확인(id 대신 username 사용)
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      res.status(404).json({
        message: "사용자를 찾을 수 없습니다.",
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      // 포인트 조회
      const pointResult = await tx.point.findUnique({
        where: {
          userId: user.id,
        },
      });

      // 포인트 조회 결과가 없으면 생성
      if (!pointResult) {
        await tx.point.create({
          data: {
            userId: user.id,
            balance: amount,
          },
        });
      } else {
        // 포인트 조회 결과가 있으면 업데이트
        await tx.point.update({
          where: {
            userId: user.id,
          },
          data: {
            balance: { increment: amount },
          },
        });
      }

      // 포인트 거래 내역 기록
      await tx.pointTransaction.create({
        data: {
          userId: user.id,
          amount,
          type: "admin_adjust",
          description: description || "관리자 직접 충전",
        },
      });
    });

    res.status(200).json({
      message: "포인트 충전이 완료되었습니다.",
      amount,
      description: description || "관리자 직접 충전",
    });
  } catch (error) {
    console.error("관리자 포인트 충전 오류:", error);
    res.status(500).json({
      message: "포인트 충전에 실패했습니다.",
    });
  }
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

// 포인트 환전 신청 생성
export const createPointWithdrawRequest = async (
  req: Request,
  res: Response
) => {
  const { amount, bankId, accountNum } = req.body;
  const userId = req.user?.id;

  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400).json({
      message: "유효하지 않은 포인트 금액입니다.",
    });
    return;
  }

  if (!bankId || !accountNum) {
    res.status(400).json({
      message: "은행명과 계좌번호를 입력해주세요.",
    });
    return;
  }

  if (amount > 10000) {
    res.status(400).json({
      message: "최소 10000원 이상 환전 가능합니다.",
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

    // 포인트 환전 신청 생성
    const withdrawRequest = await prisma.pointWithdrawRequest.create({
      data: {
        userId: userId!,
        amount: amount,
        bankId: bankId,
        accountNum: accountNum,
        status: "pending",
      },
    });

    // 포인트 잔액 업데이트
    await prisma.point.update({
      where: { userId: userId },
      data: {
        balance: { decrement: amount },
      },
    });

    res.status(201).json({
      message: "포인트 환전 신청이 성공적으로 제출되었습니다.",
      amount: amount,
      requestId: withdrawRequest.id,
    });
  } catch (error) {
    console.error("포인트 환전 신청 오류:", error);
    res.status(500).json({
      message: "포인트 환전 신청에 실패했습니다.",
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

// 은행 목록 조회
export const getBanks = async (req: Request, res: Response) => {
  try {
    const banks = await prisma.bank.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json({
      banks,
    });
  } catch (error) {
    console.error("은행 목록 조회 오류:", error);
    res.status(500).json({
      message: "은행 목록 조회에 실패했습니다.",
    });
  }
};
