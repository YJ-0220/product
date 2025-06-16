import express from "express";
import { authenticate, requiredBuyer } from "../../middleware/auth";
import { chargePoint } from "../../controllers/pointController";

const router = express.Router();

router.post("/charge", authenticate, requiredBuyer, chargePoint);

export default router;