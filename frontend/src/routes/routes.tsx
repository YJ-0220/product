import { createBrowserRouter } from "react-router-dom";
import RequireNoAuth from "@/components/RequireNoAuth";
import { Home } from "@/pages/Home";
import LoginForm from "@/pages/common/Login";
import NotFound from "@/pages/common/NotFound";
import OrderSuccess from "@/pages/buyer/OrderSuccess";
import OrderHistory from "@/pages/common/OrderHistory";
import Order from "@/pages/common/Order";
import OrderBoard from "@/components/OrderBoard";
import OrderDetail from "@/components/OrderDetail";
import PointChargePage from "@/pages/buyer/PointCharge";
import OrderRequest from "@/pages/buyer/OrderRequest";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutWrapper allowedRoles={["admin", "seller", "buyer"]}>
        <Home />
      </LayoutWrapper>
    ),
  },
  {
    path: "/users",
    element: (
      <LayoutWrapper allowedRoles={["admin"]}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">사용자 관리</h1>
          <p>사용자 관리 페이지입니다.</p>
        </div>
      </LayoutWrapper>
    ),
  },
  {
    path: "/work",
    element: (
      <LayoutWrapper allowedRoles={["admin"]}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">작업 현황</h1>
          <p>작업 현황 페이지입니다.</p>
        </div>
      </LayoutWrapper>
    ),
  },
  {
    path: "/content",
    element: (
      <LayoutWrapper allowedRoles={["admin"]}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">콘텐츠 관리</h1>
          <p>콘텐츠 관리 페이지입니다.</p>
        </div>
      </LayoutWrapper>
    ),
  },
  {
    path: "/order",
    element: (
      <LayoutWrapper allowedRoles={["buyer", "seller", "admin"]}>
        <Order />
      </LayoutWrapper>
    ),
    children: [
      {
        index: true,
        element: <OrderBoard />,
      },
      {
        path: "request",
        element: <OrderRequest />,
      },
      {
        path: ":id",
        element: <OrderDetail />,
      },
      {
        path: "success",
        element: <OrderSuccess />,
      },
      {
        path: "history",
        element: <OrderHistory />,
      },
    ],
  },
  {
    path: "/point/charge",
    element: (
      <LayoutWrapper allowedRoles={["buyer"]}>
        <PointChargePage />
      </LayoutWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <RequireNoAuth>
        <LoginForm />
      </RequireNoAuth>
    ),
  },
  {
    path: "/not-found",
    element: <NotFound />,
  },
]);
