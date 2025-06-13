import express from "express";
import { getCategories, getSubCategories } from "../controllers/orderRequestController";

const router = express.Router();

router.get("/", getCategories);
router.get("/:parentId/children", getSubCategories);

export default router;