import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function BuyerLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
