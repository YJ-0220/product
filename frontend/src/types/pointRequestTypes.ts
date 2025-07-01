export interface PointChargeRequest {
  id: string;
  userId: string;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt?: string;
  user: {
    name: string;
  };
}

export interface PointWithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt?: string;
  user: {
    name: string;
  };
}
