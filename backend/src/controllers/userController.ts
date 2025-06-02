import { Request, RequestHandler, Response } from "express";
import pool from "../db/db";
import { verifyToken } from "../utils/jwt";

export const getUserProfile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "인증이 필요합니다." });
      return;
    }

    const decoded = verifyToken(token) as { userId: number };
    const userId = decoded.userId;

    const result = await pool.query(
      "SELECT id, username, role, membership_level FROM auth.users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const userData = result.rows[0];

    const user = {
      id: userData.id as number,
      name: userData.username as string,
      role: userData.role as string,
      membershipLevel: userData.membership_level as string
    };

    res.status(200).json({
      user,
      message: "프로필 조회 성공"
    });
  } catch (error) {
    console.error("프로필 조회 오류 상세:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
};
