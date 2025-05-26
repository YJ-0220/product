import { Request, RequestHandler, Response } from "express";
import pool from "../db/db";
import { verifyToken } from "../utils/jwt";

export const getProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "인증이 필요합니다." });
      return;
    }

    const decoded = verifyToken(token) as { userId: number };
    const userId = decoded.userId;

    const result = await pool.query(
      "SELECT id, username, email, role, membership_level FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const user = result.rows[0];

    res.status(200).json(user);
  } catch (error) {
    console.error("프로필 조회 오류", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
