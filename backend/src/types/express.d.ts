import { Request } from 'express';

export declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
        membershipLevel: string | null;
      };
    }
  }
} 