import { Request, Response } from "express";
import { prisma } from "../index";

// 관리자용: 공지사항 목록 조회 (모든 공지사항)
export const getAdminNotices = async (req: Request, res: Response) => {
  try {
    const notices = await prisma.notice.findMany({
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    res.status(200).json({
      notices: notices.map((notice) => ({
        ...notice,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
        startDate: notice.startDate.toISOString(),
        endDate: notice.endDate?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("공지사항 목록 조회 실패:", error);
    res.status(500).json({ error: "공지사항 목록 조회에 실패했습니다." });
  }
};

// 일반 사용자용: 공지사항 목록 조회 (활성화된 공지사항만)
export const getPublicNotices = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    
    const notices = await prisma.notice.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    res.status(200).json({
      notices: notices.map((notice) => ({
        ...notice,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
        startDate: notice.startDate.toISOString(),
        endDate: notice.endDate?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("공지사항 목록 조회 실패:", error);
    res.status(500).json({ error: "공지사항 목록 조회에 실패했습니다." });
  }
};

// 공지사항 상세 조회
export const getNoticeById = async (req: Request, res: Response) => {
  try {
    const { noticeId } = req.params;

    const notice = await prisma.notice.findUnique({
      where: { id: noticeId },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!notice) {
      res.status(404).json({ error: "공지사항을 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({
      notice: {
        ...notice,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
        startDate: notice.startDate.toISOString(),
        endDate: notice.endDate?.toISOString(),
      },
    });
  } catch (error) {
    console.error("공지사항 상세 조회 실패:", error);
    res.status(500).json({ error: "공지사항 조회에 실패했습니다." });
  }
};

// 관리자용: 공지사항 생성
export const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, content, priority, isPinned, startDate, endDate } = req.body;
    const authorId = req.user?.id;

    if (!title || !content) {
      res.status(400).json({ error: "제목과 내용은 필수입니다." });
      return;
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        authorId: authorId!,
        priority: priority || "normal",
        isPinned: isPinned || false,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "공지사항이 생성되었습니다.",
      notice: {
        ...notice,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
        startDate: notice.startDate.toISOString(),
        endDate: notice.endDate?.toISOString(),
      },
    });
  } catch (error) {
    console.error("공지사항 생성 실패:", error);
    res.status(500).json({ error: "공지사항 생성에 실패했습니다." });
  }
};

// 관리자용: 공지사항 수정
export const updateNotice = async (req: Request, res: Response) => {
  try {
    const { noticeId } = req.params;
    const { title, content, priority, isPinned, isActive, startDate, endDate } = req.body;

    const existingNotice = await prisma.notice.findUnique({
      where: { id: noticeId },
    });

    if (!existingNotice) {
      res.status(404).json({ error: "공지사항을 찾을 수 없습니다." });
      return;
    }

    const notice = await prisma.notice.update({
      where: { id: noticeId },
      data: {
        title,
        content,
        priority,
        isPinned,
        isActive,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "공지사항이 수정되었습니다.",
      notice: {
        ...notice,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
        startDate: notice.startDate.toISOString(),
        endDate: notice.endDate?.toISOString(),
      },
    });
  } catch (error) {
    console.error("공지사항 수정 실패:", error);
    res.status(500).json({ error: "공지사항 수정에 실패했습니다." });
  }
};

// 관리자용: 공지사항 삭제
export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const { noticeId } = req.params;

    const existingNotice = await prisma.notice.findUnique({
      where: { id: noticeId },
    });

    if (!existingNotice) {
      res.status(404).json({ error: "공지사항을 찾을 수 없습니다." });
      return;
    }

    await prisma.notice.delete({
      where: { id: noticeId },
    });

    res.status(200).json({
      message: "공지사항이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("공지사항 삭제 실패:", error);
    res.status(500).json({ error: "공지사항 삭제에 실패했습니다." });
  }
}; 