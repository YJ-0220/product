import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import RequireNoAuth from "@/components/RequireNoAuth";
import Buyer from "@/pages/Buyer";
import Seller from "@/pages/Seller";
import Admin from "@/pages/Admin";
import LoginForm from "@/components/LoginForm";
import AdminLayout from "@/components/layout/AdminLayout";
import SellerLayout from "@/components/layout/SellerLayout";
import BuyerLayout from "@/components/layout/BuyerLayout";
import NotFound from "@/pages/common/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "login",
    element: <RequireNoAuth />,
    children: [
      {
        index: true,
        element: <LoginForm />,
      },
    ],
  },
  {
    element: <RequireAuth allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "admin",
            element: <Admin />,
            children: [
              { path: "users", element: <div>사용자 관리</div> },
              { path: "settings", element: <div>설정</div> },
              { path: "work", element: <div>작업 주문</div> },
              { path: "content", element: <div>콘텐츠 관리</div> },
            ],
          },
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
          {
            path: "seller",
            element: <Seller />,
            children: [
              { path: "products", element: <div>상품 관리</div> },
              { path: "orders", element: <div>주문 관리</div> },
            ],
          },
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
          {
            path: "buyer",
            element: <Buyer />,
            children: [
              { path: "orders", element: <div>주문 내역</div> },
              { path: "cart", element: <div>장바구니</div> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "not-found",
    element: <NotFound />,
  },
]);
