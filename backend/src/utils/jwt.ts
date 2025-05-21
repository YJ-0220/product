import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
};

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, getJwtSecret());
};

