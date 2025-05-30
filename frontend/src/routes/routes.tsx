import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import Home from "@/pages/Home";
import Seller from "@/pages/Seller";
import Admin from "@/pages/Admin";
import LoginForm from "@/components/LoginForm";
import AdminLayout from "@/components/layout/AdminLayout";
import SellerLayout from "@/components/layout/SellerLayout";
import BuyerLayout from "@/components/layout/BuyerLayout";

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
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <Admin /> },
          { path: "/admin/users", element: <div>사용자 관리</div> },
          { path: "/admin/settings", element: <div>설정</div> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth allowedRoles={["seller"]} />,
    children: [
      {
        element: <SellerLayout />,
        children: [
          { path: "/seller", element: <Seller /> },
          { path: "/seller/products", element: <div>상품 관리</div> },
          { path: "/seller/orders", element: <div>주문 관리</div> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth allowedRoles={["buyer"]} />,
    children: [
      {
        element: <BuyerLayout />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/orders", element: <div>주문 내역</div> },
          { path: "/cart", element: <div>장바구니</div> },
        ],
      },
    ],
  },
]);
