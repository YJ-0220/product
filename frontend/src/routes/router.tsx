import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/Login";
import Home from "@/pages/Home";
import RequireAuth from "@/components/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  }
]);
