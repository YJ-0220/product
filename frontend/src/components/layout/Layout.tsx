import { Outlet } from "react-router-dom";
import Topbar from "../Topbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#f2f7fb] text-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}