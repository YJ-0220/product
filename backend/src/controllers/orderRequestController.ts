import { Request, Response } from "express";
import pool from "../db/db";

export const createOrderRequest = async (req: Request, res: Response) => {
  const {
    category,
    subCategory,
    title,
    description,
    desired_quantity,
    budget,
  } = req.body;

  const buyerId = req.user?.id;

  try {
    const result = await pool.query(
      `INSERT INTO app.order_requests 
      (buyer_id, category_id, subcategory_id, title, description, desired_quantity, budget) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [buyerId, category, subCategory, title, description, desired_quantity, budget]
    );

    res.status(201).json({
      success: true,
      result: result.rows[0],
    });
  } catch (error) {
    console.error("주문 요청 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 요청 오류가 발생했다.",
    });
  }
};
