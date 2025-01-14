import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "../App.tsx";
import ErrorPage from "../views/ErrorPage.tsx";
import Register from "../views/Register.tsx";
import Page3 from "../views/Page3.tsx";
import Page4 from "../views/Page4.tsx";
import AppMarketPage from "../pages/app-market/index.tsx";
import UserCenterPage from "../pages/user-center/index.tsx";
import HomePage from "../pages/home/index.tsx";
import LoginPage from "../pages/login/index.tsx";
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
        path: "/page3",
        element: <Page3 />,
      },
      {
        path: "/page4",
        element: <Page4 />,
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
