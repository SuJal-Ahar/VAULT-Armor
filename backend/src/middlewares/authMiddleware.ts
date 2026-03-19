import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(403).json({ message: "No token provided" });
  }

  const parts = header.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];

  if (!token) {
     return res.status(403).json({ message: "Malformed token" });
  }

  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is missing");
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // @ts-ignore
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};