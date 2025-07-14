import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { prisma } from "../index";
import { env } from "../config/env";

export const register = (async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    const membershipLevel = role === "buyer" ? "bronze" : null;

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
        message: "비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.",
      });
      return;
    }

    // 아이디 중복 체크
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      res.status(400).json({ message: "이미 존재하는 아이디입니다." });
      return;
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 8);

    let result;
    if (role === "buyer") {
      // 구매자 회원가입
      result = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          role: role,
          membershipLevel: membershipLevel,
        },
      });
    } else {
      // 판매자 회원가입
      result = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          role: role,
        },
      });
    }

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      userId: result.id,
      user: {
        username: result.username,
        role: result.role,
        membershipLevel: result.membershipLevel,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      message: "아이디 생성에 실패했습니다.",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}) as RequestHandler;

// 로그인
export const login = (async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "아이디와 비밀번호를 입력해주세요." });
      return;
    }

    // 아이디 조회
    const result = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!result) {
      res.status(400).json({ message: "아이디가 일치하지 않습니다." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, result.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      return;
    }

    const token = generateToken(result.id.toString(), result.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "로그인이 완료되었습니다.",
      token: token,
      user: {
        id: result.id,
        username: result.username,
        role: result.role,
        membershipLevel: result.membershipLevel,
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
