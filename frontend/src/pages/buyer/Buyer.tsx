import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import { Outlet } from "react-router-dom";

export default function Buyer() {
  useEffect(() => {
    document.title = "어서오세요 - 홈페이지 입니다.";
  }, []);

  return (
    <div>
      <Topbar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
