import { NextFunction, Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { verifyToken } from "../utils/jwt";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 토큰 가져오기
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "로그인이 필요합니다.",
      });
      return;
    }

    // 2. 토큰 검증
    const decoded = verifyToken(token) as { userId: string; role: string };

    // 3. 사용자 정보 조회
    const result = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, role: true, membershipLevel: true },
    });

    if (!result) {
      res.status(401).json({
        message: "유효하지 않은 사용자입니다.",
      });
      return;
    }

    // 4. 사용자 정보를 request에 추가
    req.user = result;
    next();
  } catch (error) {
    console.error("인증 에러:", error);
    res.status(401).json({
      message: "인증에 실패했습니다.",
    });
  }
};

export const requiredAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user as { role?: string };
  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "관리자 권한이 필요합니다." });
    return;
  }
  next();
};

export const requiredBuyer: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user as { role?: string };
  if (!user || user.role !== "buyer") {
    res.status(403).json({
      message: "구매자만 접근할 수 있는 기능입니다.",
    });
    return;
  }
  next();
};

export const requiredSeller: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user as { role?: string };
  if (!user || user.role !== "seller") {
    res.status(403).json({
      message: "판매자만 접근할 수 있는 기능입니다.",
    });
    return;
  }
  next();
};