import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "../App.tsx";
import ErrorPage from "../pages/error";
import Register from "../views/Register.tsx";
import AppMarketPage from "../pages/app-market/index.tsx";
import UserCenterPage from "../pages/user-center/index.tsx";
import HomePage from "../pages/home/index.tsx";
import LoginPage from "../pages/login/index.tsx";
import EditAPPPage from "../pages/edit-app/index.tsx";
import AdminAppPage from "../pages/admin-app/index.tsx";
const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/appMarket",
        element: <AppMarketPage />,
      },
      {
        path: "/userCenter",
        element: <UserCenterPage />,
      },
      {
        path: "/editApp",
        element: <EditAPPPage />,
      },
      {
        path: "/adminApp",
        element: <AdminAppPage />,
      },
      {
        path: "/",
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);
function Router() {
  return <RouterProvider router={router} />;
}
export default Router;
