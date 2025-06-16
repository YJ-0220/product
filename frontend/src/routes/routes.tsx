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
            element: <OrderList />,
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