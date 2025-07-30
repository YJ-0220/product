export interface PointChargeRequest {
  id: string;
  userId: string;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt?: string;
  user?: {
    username: string;
    role: string;
  };
}

export interface PointWithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNum: string;
  status: string;
  requestedAt: string;
  processedAt?: string;
  user?: {
    username: string;
    role: string;
  };
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  description?: string;
  createdAt: string;
  user?: {
    username: string;
    role: string;
  };
}

export type TabType = 
  | "profile"
  | "points"
  | "charge-history"
  | "admin-approvals"
  | "admin-transactions";