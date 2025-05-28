import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import Home from "@/pages/Home";
import Seller from "@/pages/Seller";
import Admin from "@/pages/Admin";
import LoginForm from "@/components/LoginForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    element: <RequireAuth allowedRoles={["admin"]} />,
    children: [{ path: "/admin", element: <Admin /> }],
  },
  {
    element: <RequireAuth allowedRoles={["seller"]} />,
    children: [{ path: "/seller", element: <Seller /> }],
  },
  {
    element: <RequireAuth allowedRoles={["buyer"]} />,
    children: [{ path: "/home", element: <Home /> }],
  },
]);
