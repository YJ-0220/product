import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import RequireNoAuth from "@/components/RequireNoAuth";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import LoginForm from "@/pages/common/Login";
import NotFound from "@/pages/common/NotFound";
import OrderSuccess from "@/pages/buyer/OrderSuccess";
import OrderHistory from "@/pages/common/OrderHistory";
import Order from "@/pages/common/Order";
import OrderBoard from "@/components/OrderBoard";
import OrderDetail from "@/components/OrderDetail";
import OrderRequest from "@/pages/buyer/OrderRequest";
import MyPage from "@/pages/common/MyPage";
import Membership from "@/pages/common/Membership";
import PointPage from "@/pages/common/PointPage";
import PointChargeForm from "@/components/buyer/PointChargeForm";
import PointWithdrawForm from "@/components/seller/PointWithdrawForm";
import RequireAuth from "@/components/RequireAuth";
import Layout from "@/components/layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth allowedRoles={["admin", "seller", "buyer"]}>
        <LayoutWrapper>
          <Layout />
        </LayoutWrapper>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "point",
        element: (
          <RequireAuth allowedRoles={["buyer", "seller"]}>
            <PointPage />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="history" />,
          },
          {
            path: "charge",
            element: (
              <RequireAuth allowedRoles={["buyer"]}>
                <PointChargeForm />
              </RequireAuth>
            ),
          },
          {
            path: "withdraw",
            element: (
              <RequireAuth allowedRoles={["seller"]}>
                <PointWithdrawForm />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: "order",
        element: <Order />,
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
            element: (
              <RequireAuth allowedRoles={["buyer"]}>
                <OrderSuccess />
              </RequireAuth>
            ),
          },
          {
            path: "history",
            element: <OrderHistory />,
          },
        ],
      },
      {
        path: "mypage",
        element: (
          <RequireAuth allowedRoles={["buyer", "seller", "admin"]}>
            <MyPage />
          </RequireAuth>
        ),
      },
    ],
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
    path: "/mypage",
    element: (
      <LayoutWrapper allowedRoles={["buyer", "seller", "admin"]}>
        <MyPage />
      </LayoutWrapper>
    ),
    children: [
      {
        path: "point",
      },
    ],
  },
  {
    path: "/membership",
    element: (
      <LayoutWrapper allowedRoles={["buyer", "seller", "admin"]}>
        <Membership />
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
