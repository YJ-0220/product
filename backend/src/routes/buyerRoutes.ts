import express from "express";
import {
  createOrderRequest,
  getCategories,
} from "../controllers/orderRequestController";

const router = express.Router();

router.post("/order-request", createOrderRequest);
router.get("/categories", getCategories);

export default router;