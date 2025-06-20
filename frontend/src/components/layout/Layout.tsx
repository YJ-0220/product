import Topbar from "../Topbar";
import Sidebar from "./Sidebar";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-[#f2f7fb] text-black">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
