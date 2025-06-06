import { NextFunction, Request, Response } from "express";
import pool from "../db/db";
import { verifyToken } from "../utils/jwt";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 토큰 가져오기
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        message: "로그인이 필요합니다.",
      });
      return;
    }

    // 2. 토큰 검증
    const decoded = verifyToken(token) as { userId: number };

    // 3. 사용자 정보 조회
    const result = await pool.query(
      "SELECT id, username, role FROM auth.users WHERE id = $1",
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        message: "유효하지 않은 사용자입니다.",
      });
      return;
    }

    // 4. 사용자 정보를 request에 추가
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("인증 에러:", error);
    res.status(401).json({
      message: "인증에 실패했습니다.",
    });
  }
};
