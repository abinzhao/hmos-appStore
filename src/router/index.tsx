import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Suspense } from 'react';
import App from "../App";
import ErrorPage from "../pages/error";
import Register from "../views/Register";
import LoginPage from "../pages/login";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { routes } from './routes';
import AppDetailPage from "../pages/app-detail";

const generateRoutes = () => {
  return routes.map(route => ({
    path: route.path,
    element: (
      <ProtectedRoute requiredRole={route.requiredRole}>
        <Suspense fallback={<div>Loading...</div>}>
          <route.element />
        </Suspense>
      </ProtectedRoute>
    )
  }));
};
console.log("🚀 ~ generateRoutes ~ generateRoutes:", generateRoutes);

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
      ...generateRoutes(),
      {
        path: "/",
        element: <Navigate to="/home" replace />,
      },
    ],
  },
  {
    path: "/appDetail",
    element: <AppDetailPage />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
