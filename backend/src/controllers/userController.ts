import { Request, Response } from "express";
import { prisma } from "../index";

// 내 프로필 조회
export const getUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      select: {
        id: true,
        username: true,
        role: true,
        membershipLevel: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const point = await prisma.point.findUnique({
      where: { userId: userId },
      select: { balance: true },
    });

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        membershipLevel: user.membershipLevel,
      },
      points: point?.balance ?? 0,
      message: "프로필 조회 성공",
    });
  } catch (error) {
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
};
