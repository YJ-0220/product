import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/Login";
import Home from "@/pages/Home";
import RequireAuth from "@/components/RequireAuth";
import Landing from "@/pages/Landing";

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
    element: <RequireAuth />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  }
]);
