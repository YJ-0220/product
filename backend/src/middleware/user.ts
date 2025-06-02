import { Request, Response, NextFunction, RequestHandler } from "express";

export const requireAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "관리자 권한이 필요합니다." });
    return;
  }
  next();
};
