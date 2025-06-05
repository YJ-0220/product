import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/api/dashboard";

export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then(setStats)
      .catch(console.error)
  }, []);

  return { stats };
};
