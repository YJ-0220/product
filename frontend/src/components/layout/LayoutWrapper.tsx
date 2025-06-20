import Layout from "./Layout";
import RequireAuth from "@/components/RequireAuth";
import type { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export default function LayoutWrapper({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: LayoutWrapperProps) {
  if (!requireAuth) {
    return <Layout>{children}</Layout>;
  }

  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <Layout>{children}</Layout>
    </RequireAuth>
  );
} 