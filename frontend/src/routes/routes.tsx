import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
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
          <RequireAuth allowedRoles={["buyer", "seller", "admin"]}>
            <Order />
          </RequireAuth>
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
        path: "point/charge",
        element: (
          <RequireAuth allowedRoles={["buyer"]}>
            <PointChargePage />
          </RequireAuth>
        ),
      },
    ],
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
