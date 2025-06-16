import { Request, Response } from "express";
import pool from "../db/db";

export const chargePoint = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const userId = req.user?.id;

  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400).json({
      message: "유효하지 않은 포인트 금액입니다.",
    });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 포인트 조회
    const pointResult = await client.query(
      "SELECT balance FROM app.points WHERE user_id = $1",
      [userId]
    );

    if (pointResult.rows.length === 0) {
      await client.query(
        "INSERT INTO app.points (user_id, balance) VALUES ($1, $2)",
        [userId, amount]
      );
    } else {
      await client.query(
        "UPDATE app.points SET balance = balance + $1 WHERE user_id = $2",
        [amount, userId]
      );
    }

    const newBalanceResult = await client.query(
      "SELECT balance FROM app.points WHERE user_id = $1",
      [userId]
    );
    const newBalance = newBalanceResult.rows[0].balance;
    const formattedBalance = parseFloat(newBalance.toString()).toFixed(0);

    await client.query("COMMIT");
    res.status(200).json({
      message: "포인트 충전이 완료되었습니다.",
      newBalance: formattedBalance,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("포인트 충전 오류:", error);
    res.status(500).json({
      message: "포인트 충전에 실패했습니다.",
    });
  } finally {
    client.release();
  }
};

export const getPointHistory = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {}
}