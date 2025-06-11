import { Request, Response } from "express";
import pool from "../db/db";

// 주문 요청 생성
export const createOrderRequest = async (req: Request, res: Response) => {
  const {
    category,
    subCategory,
    title,
    description,
    desired_quantity,
    budget,
    deadline,
  } = req.body;

  // 구매자만 주문 요청 가능
  const buyerId = req.user?.id;

  try {
    const result = await pool.query(
      `INSERT INTO app.order_requests 
      (buyer_id, category_id, subcategory_id, title, description, desired_quantity, budget, deadline) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [buyerId, category, subCategory, title, description, desired_quantity, budget, deadline]
    );

    res.status(201).json({
      message: "주문 요청이 성공적으로 생성되었습니다.",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("주문 요청 오류:", error);
    res.status(500).json({
      message: "주문 요청 오류가 발생했습니다.",
    });
  }
};

// 카테고리 조회
export const getCategories = async (req: Request, res: Response) => {
  try {
    const parentId = req.query.parent_id;
    let query = "SELECT id, name, parent_id FROM app.categories";
    const params: any[] = [];

    if (parentId === undefined) {
      query += " WHERE parent_id IS NULL";
    } else {
      if (parentId === "null") {
        query += " WHERE parent_id IS NULL";
      } else {
        query += " WHERE parent_id = $1";
        params.push(Number(parentId));
      }
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "카테고리 조회 실패" });
  }
};