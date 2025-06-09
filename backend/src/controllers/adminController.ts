import { Request, Response } from "express";
import pool from "../db/db";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import { QueryResult } from "pg";

// 관리자 대시보드
export const getAdminDashboard: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userCountResult: QueryResult = await pool.query(
      "SELECT COUNT(*) FROM auth.users WHERE role IN ('buyer', 'seller')"
    );

    const stats = {
      totalUsers: Number(userCountResult.rows[0].count),
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 관리자 회원가입
export const adminRegister: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    const membership_level = role === "buyer" ? "bronze" : null;

    if (!username || !password) {
      res.status(400).json({ message: "빈 칸을 입력해주세요." });
      return;
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   return res
    //     .status(400)
    //     .json({ message: "이메일 형식이 올바르지 않습니다." });
    // }

    if (role !== "buyer" && role !== "seller") {
      res.status(400).json({ message: "올바른 역할을 선택해주세요." });
      return;
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message: "비밀번호는 8자 이상, 영문과 숫자, 특수문자를 포함해야 합니다.",
      });
      return;
    }

    const existingUser = await pool.query(
      "SELECT * FROM auth.users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ message: "이미 존재하는 아이디입니다." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let result;
    if (role === "buyer") {
      result = await pool.query(
        "INSERT INTO auth.users (username, password, role, membership_level) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, hashedPassword, role, membership_level]
      );
    } else {
      result = await pool.query(
        "INSERT INTO auth.users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
        [username, hashedPassword, role]
      );
    }

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      user: result.rows[0].id,
      username: result.rows[0].username,
      role: result.rows[0].role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "아이디 생성에 실패했습니다." });
  }
};

// 관리자 사용자 삭제
export const AdminDeleteUser = async (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    res.status(400).json({ message: "사용자 ID가 필요합니다." });
    return;
  }
  try {
    const result = await pool.query(
      "DELETE FROM auth.users WHERE username = $1 RETURNING *",
      [username]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({
      message: "사용자가 삭제되었습니다.",
      deletedUser: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "사용자 삭제에 실패했습니다." });
  }
};

// 관리자 아이디 테스트
export const createAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "아이디와 비밀번호를 입력해주세요." });
    return;
  }
  const existingAdmin = await pool.query(
    "SELECT * FROM auth.users WHERE username = $1",
    [username]
  );

  if (existingAdmin.rows.length > 0) {
    res.status(400).json({ message: "이미 존재하는 관리자 아이디입니다." });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO auth.users (username, password, role)
       VALUES ($1, $2, 'admin')
       RETURNING *`,
      [username, hashedPassword]
    );

    console.log("관리자 계정 생성 완료:", result.rows[0]);
    res.status(201).json({
      message: "관리자 계정이 생성되었습니다.",
      admin: result.rows[0],
    });
  } catch (error) {
    console.error("관리자 생성 실패:", error);
    res.status(500).json({ message: "관리자 생성에 실패했습니다." });
  }
};
