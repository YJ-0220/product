import express from "express";
import { createOrderRequest } from "../controllers/orderRequestController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/order-request", authenticate, createOrderRequest);

export default router;