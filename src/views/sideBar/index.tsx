import { Menu } from "@arco-design/web-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../store";
import { routes, RouteConfig } from "../../router/routes";

const MenuItem = Menu.Item;

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();

  // 根据用户角色过滤路由
  const filterRoutesByRole = (routes: RouteConfig[]) => {
    return routes.filter((route) => {
      if (route.visible) return false;
      if (!route.requiredRole) return true;
      return user.role === route.requiredRole || user.role === "admin";
    });
  };

  const filteredRoutes = filterRoutesByRole(routes);

  return (
    <div className="h-full">
      <div className="flex items-center justify-center h-16">
        <img className="h-8" src="/src/assets/image/hmos-logo.png" alt="logo" />
        <span className="ml-2 text-xl font-bold" style={{ color: "rgb(var(--primary-6))" }}>
          HMOS 应用商店
        </span>
      </div>
      <Menu selectedKeys={[location.pathname]} onClickMenuItem={(key) => navigate(key)}>
        {filteredRoutes.map((route) => (
          <MenuItem key={route.path}>
            {route.icon && <span className="mr-2">{route.icon}</span>}
            {route.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default SideBar;
