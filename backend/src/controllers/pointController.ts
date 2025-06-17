import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

      const newBalanceResult = await tx.point.findUnique({
        where: {
          userId: userId,
        },
      });
      const newBalance = newBalanceResult?.balance;
      const formattedBalance = newBalance ? parseFloat(newBalance.toString()).toFixed(0) : 0;

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
    pointHistory: pointHistory,
  });
};