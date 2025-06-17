import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import RequireNoAuth from "@/components/RequireNoAuth";
import { Home } from "@/pages/Home";
import LoginForm from "@/pages/common/Login";
import NotFound from "@/pages/common/NotFound";
import OrderSuccess from "@/pages/buyer/OrderSuccess";
import OrderHistory from "@/pages/common/OrderHistory";
import OrderBoard from "@/pages/common/OrderBoard";
import OrderList from "@/components/OrderList";
import OrderDetail from "@/components/OrderDetail";
import PointChargePage from "@/pages/buyer/PointCharge";
import OrderRequest from "@/pages/buyer/OrderRequest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth allowedRoles={["admin", "seller", "buyer"]}>
        <Home />
      </RequireAuth>
    ),
    children: [
      {
        path: "order",
        element: (
          <RequireAuth allowedRoles={["buyer", "seller"]}>
            <OrderBoard />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: (
              <RequireAuth allowedRoles={["buyer", "seller"]}>
                <OrderList />
              </RequireAuth>
            ),
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
            path: ":id",
            element: (
              <RequireAuth allowedRoles={["buyer", "seller"]}>
                <OrderDetail />
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
            path: "history",
            element: (
              <RequireAuth allowedRoles={["buyer", "seller"]}>
                <OrderHistory />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: "point/charge",
        element: (
          <RequireAuth allowedRoles={["buyer"]}>
            <PointChargePage />
          </RequireAuth>
        ),
      },
    ]
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