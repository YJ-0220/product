import { Request } from 'express';

export declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
        membership_level: string;
      };
    }
  }
} 