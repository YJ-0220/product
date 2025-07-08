import jwt from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET;

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET as string, { expiresIn: "12h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET as string);
};
