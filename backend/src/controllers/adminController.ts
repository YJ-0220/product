import { Request, Response } from "express";
import { prisma } from "../index";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";

// 관리자 대시보드
export const getAdminDashboard: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userCountResult = await prisma.user.count({
      where: {
        role: {
          in: ["buyer", "seller"],
        },
      },
    });

    const stats = {
      totalUsers: userCountResult,
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 관리자 회원가입
export const adminRegister: RequestHandler = async (
  req: Request,
  res: Response
) => {
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
        message:
          "비밀번호는 8자 이상, 영문과 숫자, 특수문자를 포함해야 합니다.",
      });
      return;
    }

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
    const hashedPassword = await bcrypt.hash(password, 10);

    let result;
    if (role === "buyer") {
      result = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          role: role,
          membershipLevel: membership_level,
        },
      });
    } else {
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
      id: result.id,
      username: result.username,
      role: result.role,
      membershipLevel: result.membershipLevel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "아이디 생성에 실패했습니다." });
  }
};

// 관리자 사용자 삭제
export const adminDeleteUser = async (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    res.status(400).json({ message: "사용자 ID가 필요합니다." });
    return;
  }
  try {
    const result = await prisma.user.delete({
      where: {
        username: username,
      },
    });

    if (!result) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({
      message: "사용자가 삭제되었습니다.",
      deletedUser: result,
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
  const existingAdmin = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (existingAdmin) {
    res.status(400).json({ message: "이미 존재하는 관리자 아이디입니다." });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("관리자 계정 생성 완료:", result);
    res.status(201).json({
      message: "관리자 계정이 생성되었습니다.",
      admin: result,
    });
  } catch (error) {
    console.error("관리자 생성 실패:", error);
    res.status(500).json({ message: "관리자 생성에 실패했습니다." });
  }
};

// 관리자용 사용자 목록 조회
export const getAllUserList = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["buyer", "seller"],
        },
      },
      select: {
        id: true,
        username: true,
        role: true,
        membershipLevel: true,
      },
    });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("사용자 목록 조회 오류:", error);
    res.status(500).json({
      message: "사용자 목록 조회에 실패했습니다.",
    });
  }
};

// 관리자용: 모든 포인트 충전 신청 목록 조회
export const getAllPointChargeRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const chargeRequests = await prisma.pointChargeRequest.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    res.status(200).json({
      chargeRequests: chargeRequests.map((request) => ({
        ...request,
        user: { name: request.user.username },
        requestedAt: request.requestedAt.toISOString(),
        approvedAt: request.approvedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("포인트 충전 신청 목록 조회 오류:", error);
    res.status(500).json({
      message: "포인트 충전 신청 목록 조회에 실패했습니다.",
    });
  }
};

// 관리자용: 포인트 충전 신청 승인/거절
export const updatePointChargeRequestStatus = async (
  req: Request,
  res: Response
) => {
  const { requestId } = req.params;
  const { status } = req.body; // 'approved' 또는 'rejected'

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({
      message: "유효하지 않은 상태값입니다.",
    });
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 충전 신청 조회
      const chargeRequest = await tx.pointChargeRequest.findUnique({
        where: { id: requestId },
      });

      if (!chargeRequest) {
        throw new Error("충전 신청을 찾을 수 없습니다.");
      }

      if (chargeRequest.status !== "pending") {
        throw new Error("이미 처리된 신청입니다.");
      }

      // 신청 상태 업데이트
      await tx.pointChargeRequest.update({
        where: { id: requestId },
        data: {
          status: status,
          approvedAt: status === "approved" ? new Date() : null,
        },
      });

      // 승인된 경우 포인트 충전
      if (status === "approved") {
        const pointRecord = await tx.point.findUnique({
          where: { userId: chargeRequest.userId },
        });

        if (!pointRecord) {
          await tx.point.create({
            data: {
              userId: chargeRequest.userId,
              balance: chargeRequest.amount,
            },
          });
        } else {
          await tx.point.update({
            where: { userId: chargeRequest.userId },
            data: {
              balance: { increment: chargeRequest.amount },
            },
          });
        }

        // 포인트 거래 내역 기록
        await tx.pointTransaction.create({
          data: {
            userId: chargeRequest.userId,
            type: "charge",
            amount: chargeRequest.amount,
            description: "관리자 승인 포인트 충전",
          },
        });
      }
    });

    res.status(200).json({
      message: `포인트 충전 신청이 ${
        status === "approved" ? "승인" : "거절"
      }되었습니다.`,
    });
  } catch (error: any) {
    console.error("포인트 충전 신청 처리 오류:", error);
    res.status(500).json({
      message: error.message || "포인트 충전 신청 처리에 실패했습니다.",
    });
  }
};

// 관리자용: 포인트 환전 신청 승인/거절
export const updatePointWithdrawRequestStatus = async (
  req: Request,
  res: Response
) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({
      message: "유효하지 않은 상태값입니다.",
    });
    return;
  }

  try {
    const withdrawRequest = await prisma.pointWithdrawRequest.findUnique({
      where: { id: requestId },
    });

    if (!withdrawRequest || withdrawRequest.status !== "pending") {
      res.status(400).json({
        message: "환전 신청을 찾을 수 없거나 이미 처리된 신청입니다.",
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      if (status === "approved") {
        await tx.point.update({
          where: { userId: withdrawRequest.userId },
          data: { balance: { decrement: withdrawRequest.amount } },
        });

        await tx.pointTransaction.create({
          data: {
            userId: withdrawRequest.userId,
            amount: withdrawRequest.amount,
            type: "withdraw",
            description: "포인트 환전 승인",
          },
        });

        await tx.pointWithdrawRequest.update({
          where: { id: requestId },
          data: { status: "approved" },
        });
      } else if (status === "rejected") {
        // 포인트 환전 신청 거절 시 포인트 잔액 복구
        await tx.point.update({
          where: { userId: withdrawRequest.userId },
          data: { balance: { increment: withdrawRequest.amount } },
        });

        // 포인트 환전 신청 상태 업데이트
        await tx.pointWithdrawRequest.update({
          where: { id: requestId },
          data: { status: "rejected" },
        });
      }
    });

    res.status(200).json({
      message: `포인트 환전 신청이 ${
        status === "approved" ? "승인" : "거절"
      }되었습니다.`,
    });
  } catch (error: any) {
    console.error("포인트 환전 신청 처리 오류:", error);
    res.status(500).json({
      message: error.message || "포인트 환전 신청 처리에 실패했습니다.",
    });
  }
};
