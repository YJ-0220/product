import { Request, Response } from "express";
import pool from "../db/db";

// 주문 요청 생성
export const createOrderRequest = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const {
      category_id,
      subcategory_id,
      title,
      description,
      desired_quantity,
      required_points,
      deadline,
    } = req.body;

    console.log("요청 body:", req.body);
    console.log("req.user:", req.user);

    const buyerId = req.user?.id;

    if (!buyerId) {
      res.status(401).json({
        message: "인증이 필요합니다.",
      });
      return;
    }

    await client.query("BEGIN");

    // 포인트 조회
    const pointResult = await client.query(
      "SELECT balance FROM app.points WHERE user_id = $1",
      [buyerId]
    );

    const currentPoint = pointResult.rows[0].balance;

    // 포인트 부족 시 예외 처리
    if (currentPoint < required_points) {
      await client.query("ROLLBACK");
      res.status(400).json({
        message: "포인트가 부족합니다.",
      });
      return;
    }

    // 주문 요청 생성
    const order = await client.query(
      `INSERT INTO app.order_requests 
      (buyer_id, category_id, subcategory_id, title, description, desired_quantity, deadline, required_points) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        buyerId,
        category_id,
        subcategory_id,
        title,
        description,
        desired_quantity,
        deadline,
        required_points,
      ]
    );
    // 포인트 차감
    await client.query(
      "UPDATE app.points SET balance = balance - $1 WHERE user_id = $2",
      [required_points, buyerId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "주문 요청이 성공적으로 생성되었습니다.",
      order: order.rows[0],
      remainingPoint: currentPoint - required_points,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({
      message: "주문 요청 오류가 발생했다.",
      error: error,
    });
  } finally {
    client.release();
  }
};

// 카테고리 조회
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, parent_id FROM app.categories"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "카테고리 조회 실패" });
  }
};

// 하위 카테고리 조회
export const getSubCategories = async (req: Request, res: Response) => {
  const { parent_id } = req.query;
  try {
    const { rows } = await pool.query(
      "SELECT id, name, parent_id FROM app.subcategories WHERE parent_id = $1",
      [parent_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "하위 카테고리 조회 실패" });
  }
};
