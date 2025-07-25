import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import RequireNoAuth from "@/components/RequireNoAuth";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import MyPage from "@/pages/common/MyPage";
import Membership from "@/pages/common/Membership";
import Login from "@/pages/common/Login";
import EmptyLayout from "@/components/layout/EmptyLayout";
import OrderBoard from "@/pages/common/OrderBoard";
import OrderDetail from "@/components/common/OrderDetail";
import OrderRequest from "@/pages/buyer/OrderRequest";
import OrderSuccess from "@/pages/buyer/OrderSuccess";
import OrderHistory from "@/pages/common/OrderHistory";
import PointChargeHistory from "@/pages/buyer/PointChargeHistory";
import PointChargeForm from "@/components/buyer/PointChargeForm";
import PointWithdrawForm from "@/components/seller/PointWithdrawForm";
import NotFound from "@/pages/common/NotFound";
import WorkList from "@/pages/common/WorkList";
import WorkDetail from "@/pages/common/WorkDetail";
import WorkSubmitForm from "@/components/seller/WorkSubmitForm";
import WorkEditForm from "@/components/seller/WorkEditForm";
import UserList from "@/pages/admin/UserList";
import UserCreate from "@/pages/admin/UserCreate";
import NoticeManagement from "@/pages/admin/NoticeManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutWrapper allowedRoles={["admin", "seller", "buyer"]}>
        <Layout />
      </LayoutWrapper>
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
            <EmptyLayout />
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
          {
            path: "history",
            element: (
              <RequireAuth allowedRoles={["buyer"]}>
                <PointChargeHistory />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: "order",
        element: (
          <RequireAuth allowedRoles={["buyer", "seller", "admin"]}>
            <EmptyLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <OrderBoard />,
          },
          {
            path: "request",
            element: (
              <RequireAuth allowedRoles={["buyer"]}>
                <OrderRequest />
              </RequireAuth>
            ),
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
            path: ":orderId",
            element: (
              <RequireAuth allowedRoles={["buyer", "seller", "admin"]}>
                <EmptyLayout />
              </RequireAuth>
            ),
            children: [
              {
                index: true,
                element: <OrderDetail />,
              },
            ],
          },
          {
            path: "work",
            element: (
              <RequireAuth allowedRoles={["seller"]}>
                <EmptyLayout />
              </RequireAuth>
            ),
            children: [
              {
                index: true,
                element: <WorkList />,
              },
              {
                path: "submit",
                element: <WorkSubmitForm />,
              },
              {
                path: ":workItemId/edit",
                element: <WorkEditForm />,
              },
            ],
          },
          {
            path: "work/:workItemId",
            element: (
              <RequireAuth allowedRoles={["seller", "buyer", "admin"]}>
                <WorkDetail />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: "membership",
        element: (
          <RequireAuth allowedRoles={["buyer"]}>
            <Membership />
          </RequireAuth>
        ),
      },
      {
        path: "users",
        element: (
          <RequireAuth allowedRoles={["admin"]}>
            <EmptyLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <UserList />,
          },
          {
            path: "create",
            element: <UserCreate />,
          },
        ],
      },
      {
        path: "content",
        element: (
          <RequireAuth allowedRoles={["admin"]}>
            <EmptyLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <NoticeManagement />,
          },
        ],
      },
      {
        path: "my",
        element: (
          <RequireAuth allowedRoles={["buyer", "seller", "admin"]}>
            <EmptyLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <MyPage />,
          },
          {
            path: "order",
            element: <OrderHistory />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: (
      <RequireNoAuth>
        <Login />
      </RequireNoAuth>
    ),
  },
  {
    path: "/not-found",
    element: <NotFound />,
  },
]);
