import { useState, useEffect, useCallback } from "react";
import { getKPIChartData } from "@/api/admin";
import type { KPIData, UseKPIDataReturn } from "@/types/dashBoardTypes";

export const useKPIData = (): UseKPIDataReturn => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKPIChartData();
      setKpiData(data);
    } catch (err: any) {
      console.error("KPI 데이터 로딩 실패:", err);
      setError(
        err.response?.data?.message || "KPI 데이터를 불러오는데 실패했습니다."
      );
      setKpiData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKPIData();
  }, [fetchKPIData]);

  return {
    kpiData,
    loading,
    error,
    refetch: fetchKPIData,
  };
};
