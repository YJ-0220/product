export interface KPIData {
  userGrowth: {
    labels: string[];
    data: number[];
  };
  orderStatus: {
    labels: string[];
    data: number[];
  };
  userRole: {
    labels: string[];
    data: number[];
  };
  pointTransactions: {
    type: string;
    totalAmount: number;
    count: number;
  }[];
}

export interface UseKPIDataReturn {
  kpiData: KPIData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
