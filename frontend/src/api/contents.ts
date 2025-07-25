import api from "./axios";

export interface Notice {
  id: string;
  title: string;
  content: string;
  authorId: string;
  priority: "normal" | "important" | "urgent";
  isActive: boolean;
  isPinned: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
  };
}

export interface CreateNoticeData {
  title: string;
  content: string;
  priority?: "normal" | "important" | "urgent";
  isPinned?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateNoticeData extends CreateNoticeData {
  isActive?: boolean;
}

// 관리자용: 모든 공지사항 조회
export const getAdminNotices = async (): Promise<{ notices: Notice[] }> => {
  const response = await api.get("/contents/admin/all");
  return response.data;
};

// 일반 사용자용: 공개 공지사항 조회
export const getPublicNotices = async (): Promise<{ notices: Notice[] }> => {
  const response = await api.get("/contents/public");
  return response.data;
};

// 공지사항 상세 조회
export const getNoticeById = async (noticeId: string): Promise<{ notice: Notice }> => {
  const response = await api.get(`/contents/${noticeId}`);
  return response.data;
};

// 관리자용: 공지사항 생성
export const createNotice = async (data: CreateNoticeData) => {
  const response = await api.post("/contents", data);
  return response.data;
};

// 관리자용: 공지사항 수정
export const updateNotice = async (noticeId: string, data: UpdateNoticeData) => {
  const response = await api.put(`/contents/${noticeId}`, data);
  return response.data;
};

// 관리자용: 공지사항 삭제
export const deleteNotice = async (noticeId: string) => {
  const response = await api.delete(`/contents/${noticeId}`);
  return response.data;
}; 