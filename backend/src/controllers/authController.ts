import { Request, Response, RequestHandler } from "express";
import pool from "../db/db";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

// 사용자 회원가입
// export const register = (async (req: Request, res: Response) => {
//   try {
//     const { username, password, role } = req.body;

//     const membership_level = role === "buyer" ? "bronze" : null;

//     if (!username || !password) {
//       res.status(400).json({ message: "빈 칸을 입력해주세요." });
//       return;
//     }

//     // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     // if (!emailRegex.test(email)) {
//     //   return res
//     //     .status(400)
//     //     .json({ message: "이메일 형식이 올바르지 않습니다." });
//     // }

//     if (role !== "buyer" && role !== "seller") {
//       res.status(400).json({ message: "올바른 역할을 선택해주세요." });
//       return;
//     }

//     const passwordRegex =
//       /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       res.status(400).json({
//         message: "비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.",
//       });
//       return;
//     }

//     const existingUser = await pool.query(
//       "SELECT * FROM auth.users WHERE username = $1",
//       [username]
//     );

//     if (existingUser.rows.length > 0) {
//       res.status(400).json({ message: "이미 존재하는 아이디입니다." });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let result;
//     if (role === "buyer") {
//       result = await pool.query(
//         "INSERT INTO auth.users (username, password, role, membership_level) VALUES ($1, $2, $3, $4) RETURNING *",
//         [username, hashedPassword, role, membership_level]
//       );
//     } else {
//       result = await pool.query(
//         "INSERT INTO auth.users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
//         [username, hashedPassword, role]
//       );
//     }

//     res.status(201).json({
//       message: "회원가입이 완료되었습니다.",
//       user: result.rows[0].id,
//       username: result.rows[0].username,
//       role: result.rows[0].role,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "아이디 생성에 실패했습니다." });
//   }
// }) as RequestHandler;

// 로그인
export const login = (async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "아이디와 비밀번호를 입력해주세요." });
      return;
    }

    // 아이디 조회
    const result = await pool.query(
      "SELECT * FROM auth.users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ message: "아이디가 일치하지 않습니다." });
      return;
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      return;
    }

    const token = generateToken(user.id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "로그인이 완료되었습니다.",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        membership_level: user.membership_level,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "로그인에 실패했습니다." });
  }
}) as RequestHandler;

// 로그아웃
export const logout = (async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "로그아웃이 완료되었습니다." });
  } catch (e) {
    res.status(500).json({ message: "서버 오류" });
  }
}) as RequestHandler;
