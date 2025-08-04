import { Request, Response } from "express";
import { prisma } from "../index";
import bcrypt from "bcrypt";

// KPI 차트 데이터 조회
export const getKPIChartData = async (req: Request, res: Response) => {
  try {
    // 1. 사용자 증가 추이 (지난 7일)
    const userGrowthData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const userCount = await prisma.user.count({
        where: {
          isDeleted: false,
          role: { in: ["buyer", "seller"] },
          createdAt: { gte: date, lt: nextDate },
        },
      });

      userGrowthData.push({
        date: date.toISOString().split("T")[0],
        count: userCount,
      });
    }

    // 2. 주문 상태별 분포
    const orderStatusData = await Promise.all([
      prisma.orderRequest.count({ where: { status: "pending" } }),
      prisma.orderRequest.count({ where: { status: "progress" } }),
      prisma.orderRequest.count({ where: { status: "completed" } }),
      prisma.orderRequest.count({ where: { status: "cancelled" } }),
    ]);

    // 3. 역할별 사용자 분포
    const userRoleData = await Promise.all([
      prisma.user.count({ where: { role: "buyer", isDeleted: false } }),
      prisma.user.count({ where: { role: "seller", isDeleted: false } }),
      prisma.user.count({ where: { role: "admin", isDeleted: false } }),
    ]);

    // 4. 포인트 거래 통계 (지난 30일)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pointStats = await prisma.pointTransaction.groupBy({
      by: ["type"],
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { amount: true },
      _count: { _all: true },
    });

    const kpiData = {
      userGrowth: {
        labels: userGrowthData.map((d) => d.date),
        data: userGrowthData.map((d) => d.count),
      },
      orderStatus: {
        labels: ["대기중", "진행중", "완료", "취소"],
        data: orderStatusData,
      },
      userRole: {
        labels: ["구매자", "판매자", "관리자"],
        data: userRoleData,
      },
      pointTransactions: pointStats.map((stat) => ({
        type: stat.type,
        totalAmount: stat._sum.amount || 0,
        count: stat._count._all,
      })),
    };

    res.json(kpiData);
  } catch (error: any) {
    console.error("KPI 데이터 조회 에러:", error);
    res.status(500).json({
      message: "KPI 데이터를 불러오는 중 오류가 발생했습니다.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 회원가입
export const adminRegister = async (req: Request, res: Response) => {
  try {
    const { username, password, role, membershipLevel } = req.body;

    // 구매자일 때 멤버십 등급 설정 (기본값: bronze)
    const membership_level =
      role === "buyer" ? membershipLevel || "bronze" : null;

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

    // 구매자일 때 멤버십 등급 유효성 검사
    if (
      role === "buyer" &&
      !["bronze", "silver", "gold", "platinum", "vip"].includes(
        membership_level
      )
    ) {
      res.status(400).json({ message: "올바른 멤버십 등급을 선택해주세요." });
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
  } catch (error: any) {
    console.error("관리자 회원가입 에러:", error);

    let userMessage = "회원가입 처리 중 오류가 발생했습니다.";

    if (error.code === "P2002") {
      userMessage = "이미 존재하는 아이디입니다.";
    } else if (error.name === "ValidationError") {
      userMessage = "입력 데이터가 올바르지 않습니다.";
    } else if (process.env.NODE_ENV === "development") {
      userMessage = error.message;
    }

    res.status(500).json({
      message: userMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 사용자 삭제
export const adminDeleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "사용자 ID가 필요합니다." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      message: "사용자가 삭제되었습니다.",
      deletedUser: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "사용자 삭제에 실패했습니다." });
  }
};

// 사용자 완전 삭제
export const adminDeleteUserHard = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 해당 사용자의 신청서들 조회
      const userApplications = await tx.orderApplication.findMany({
        where: { sellerId: userId },
        include: {
          workItems: true,
        },
      });

      // 2. 작업물이 없는 신청서들 찾기
      const applicationsWithoutWork = userApplications.filter(
        (app) => app.workItems.length === 0
      );

      // 3. 작업물이 없는 신청서들 직접 삭제
      if (applicationsWithoutWork.length > 0) {
        await tx.orderApplication.deleteMany({
          where: {
            id: {
              in: applicationsWithoutWork.map((app) => app.id),
            },
          },
        });
      }

      // 4. 사용자 삭제 (작업물이 있는 신청서들은 SetNull로 sellerId만 null로 설정됨)
      const deletedUser = await tx.user.delete({
        where: { id: userId },
      });

      return {
        deletedUser,
        deletedApplicationsCount: applicationsWithoutWork.length,
        preservedApplicationsCount:
          userApplications.length - applicationsWithoutWork.length,
      };
    });

    res.status(200).json({
      message: "사용자가 완전 삭제되었습니다.",
      details: {
        deletedApplications: result.deletedApplicationsCount,
        preservedApplications: result.preservedApplicationsCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "사용자 완전 삭제에 실패했습니다." });
  }
};

// 사용자 복구
export const adminRestoreUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: false },
    });

    res.status(200).json({
      message: "사용자가 복구되었습니다.",
      restoredUser: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "사용자 복구에 실패했습니다." });
  }
};

// 아이디 테스트
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

// 사용자 목록 조회
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
        isDeleted: true,
        createdAt: true,
      },
      orderBy: [
        { isDeleted: "asc" }, // 삭제되지 않은 사용자를 먼저 표시
        { createdAt: "desc" }, // 최신 등록순으로 정렬
      ],
    });

    res.status(200).json({
      users,
    });
  } catch (error: any) {
    console.error("사용자 목록 조회 에러:", error);

    let userMessage = "사용자 목록을 불러오는 중 오류가 발생했습니다.";

    if (error.code === "P2025") {
      userMessage = "데이터를 찾을 수 없습니다.";
    } else if (process.env.NODE_ENV === "development") {
      userMessage = error.message;
    }

    res.status(500).json({
      message: userMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 포인트 충전 신청 목록 조회
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
        user: { username: request.user?.username },
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

// 포인트 환전 신청 목록 조회
export const getAllPointWithdrawRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const withdrawRequests = await prisma.pointWithdrawRequest.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
        bank: true,
      },
      orderBy: {
        requestedAt: "desc",
      },
    });
    res.status(200).json({
      withdrawRequests: withdrawRequests.map((request) => ({
        ...request,
        user: { username: request.user?.username },
        bankName: request.bank.name,
        requestedAt: request.requestedAt.toISOString(),
        processedAt: request.processedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("포인트 환전 신청 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "포인트 환전 신청 목록 조회에 실패했습니다." });
  }
};

// 포인트 충전 신청 승인/거절
export const updatePointChargeRequestStatus = async (
  req: Request,
  res: Response
) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({
      message: "승인 또는 거절 중 하나를 선택해주세요.",
    });
    return;
  }

  try {
    const chargeRequest = await prisma.pointChargeRequest.findUnique({
      where: { id: requestId },
    });

    // 충전 신청 조회
    if (!chargeRequest || chargeRequest.status !== "pending") {
      res.status(400).json({
        message: "충전 신청을 찾을 수 없습니다.",
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      if (status === "approved") {
        // 포인트 잔액 조회
        const pointRecord = await tx.point.findUnique({
          where: { userId: chargeRequest.userId! },
        });

        // 포인트 잔액 조회
        if (!pointRecord) {
          await tx.point.create({
            data: {
              userId: chargeRequest.userId!,
              balance: chargeRequest.amount,
            },
          });
        } else {
          // 포인트 잔액 증가
          await tx.point.update({
            where: { userId: chargeRequest.userId! },
            data: {
              balance: { increment: chargeRequest.amount },
            },
          });
        }

        // 신청 상태 업데이트
        await tx.pointChargeRequest.update({
          where: { id: requestId },
          data: {
            status: "approved",
            approvedAt: new Date(),
          },
        });

        // 포인트 거래 내역 기록
        await tx.pointTransaction.create({
          data: {
            userId: chargeRequest.userId!,
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

// 포인트 환전 신청 승인/거절
export const updatePointWithdrawRequestStatus = async (
  req: Request,
  res: Response
) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({
      message: "승인 또는 거절 중 하나를 선택해주세요.",
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
        // 포인트 환전 내역 기록
        await tx.pointTransaction.create({
          data: {
            userId: withdrawRequest.userId!,
            amount: withdrawRequest.amount,
            type: "withdraw",
            description: "포인트 환전 승인",
          },
        });

        // 포인트 환전 신청 상태 업데이트
        await tx.pointWithdrawRequest.update({
          where: { id: requestId },
          data: {
            status: "approved",
            processedAt: new Date(),
          },
        });
      } else if (status === "rejected") {
        // 포인트 환전 신청 거절 시 포인트 잔액 복구
        await tx.point.update({
          where: { userId: withdrawRequest.userId! },
          data: { balance: { increment: withdrawRequest.amount } },
        });

        // 포인트 환전 신청 상태 업데이트
        await tx.pointWithdrawRequest.update({
          where: { id: requestId },
          data: {
            status: "rejected",
            processedAt: new Date(),
          },
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

// 관리자용: 전체 포인트 거래 내역 조회
export const getAllPointTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.pointTransaction.findMany({
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      transactions: transactions.map((transaction) => ({
        ...transaction,
        user: {
          username: transaction.user?.username,
          role: transaction.user?.role,
        },
        createdAt: transaction.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("포인트 거래 내역 조회 오류:", error);
    res.status(500).json({
      message: "포인트 거래 내역 조회에 실패했습니다.",
    });
  }
};
