import { Navigate } from "react-router-dom";
import { useUserStore } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const { user } = useUserStore();

  // 检查是否登录
  if (!token && !localStorage.getItem("experience")) {
    return <Navigate to="/login" replace />;
  }

  // 检查角色权限
  if (requiredRole) {
    // admin 可以访问所有页面
    if (user.role === 'admin') {
      return <>{children}</>;
    }

    // 检查普通用户权限
    if (user.role !== requiredRole) {
      console.log(user)
      return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
}; 