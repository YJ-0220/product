import Layout from "./Layout";
import RequireAuth from "@/components/RequireAuth";
import type { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export default function LayoutWrapper({ 
  allowedRoles = [], 
  requireAuth = true 
}: LayoutWrapperProps) {
  if (!requireAuth) {
    return <Layout />;
  }

  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <Layout />
    </RequireAuth>
  );
} 