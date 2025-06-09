import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/api/dashboard";

interface DashboardStats {
  totalUsers: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getAdminDashboard()
      .then(setStats)
      .catch(console.error)
  }, []);

  return { stats };
};
