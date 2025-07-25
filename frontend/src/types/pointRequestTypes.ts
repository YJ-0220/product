export interface PointChargeRequest {
  id: string;
  userId: string;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt?: string;
  user?: {
    username: string;
  };
}

export interface PointWithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  bankId: string;
  bankName: string;
  accountNum: string;
  status: string;
  requestedAt: string;
  processedAt?: string;
  user?: {
    username: string;
  };
}

export interface Bank {
  id: string;
  name: string;
  accountNumLength?: number;
}
