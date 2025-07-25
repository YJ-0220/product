import express from "express";
import {
  authenticate,
  requiredAdmin,
} from "../middleware/auth";
import {
  getAdminNotices,
  getPublicNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/contentController";

const router = express.Router();

router.use(authenticate);

// 일반 사용자용 공지사항 조회 (인증 필요)
router.get("/public", getPublicNotices);
router.get("/:noticeId", getNoticeById);

// 관리자용 공지사항 관리
router.get("/admin/all", requiredAdmin, getAdminNotices);
router.post("/", requiredAdmin, createNotice);
router.put("/:noticeId", requiredAdmin, updateNotice);
router.delete("/:noticeId", requiredAdmin, deleteNotice);

export default router; 