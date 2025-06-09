import { Request, Response, NextFunction, RequestHandler } from "express";

// 관리자 권한 확인
export const requireAdmin: RequestHandler = (
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
