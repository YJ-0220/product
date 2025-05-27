import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import LoginPage from "@/pages/Login";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Seller from "@/pages/Seller";
import Admin from "@/pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <RequireAuth allowedRoles={["buyer"]} />,
    children: [{ path: "/home", element: <Home /> }],
  },
  {
    element: <RequireAuth allowedRoles={["seller"]} />,
    children: [{ path: "/seller", element: <Seller /> }],
  },
  {
    element: <RequireAuth allowedRoles={["admin"]} />,
    children: [{ path: "/admin", element: <Admin /> }],
  },
]);
