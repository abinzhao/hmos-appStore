/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "@arco-design/web-react";
import { IconSettings, IconFire, IconBook, IconHome } from "@arco-design/web-react/icon";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "../../store";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

function SideBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, addRouterHistory } = useGlobalStore();
  // const menu = [
  //   {
  //     key: "2",
  //     title: t("个人中心"),
  //     link: "/page2",
  //     icon: <IconSettings />,
  //     children: [
  //       {
  //         key: "2-1",
  //         title: t("个人主页"),
  //         link: "/page3",
  //         icon: <IconBook />,
  //       },
  //       {
  //         key: "2-2",
  //         title: t("我的应用"),
  //         link: "/page4",
  //         icon: <IconBook />,
  //       },
  //     ],
  //   },
  // ];
  const renderMenu = (
    <Menu
      selectedKeys={[location.pathname]}
      defaultOpenKeys={["1"]}
      defaultSelectedKeys={[location.pathname]}
      onClickMenuItem={(key: string) => addRouterHistory(key)}
      style={{ width: "100%" }}>
      <MenuItem
        key="/home"
        onClick={() => {
          addRouterHistory("/home");
          navigate("/home");
        }}>
        <IconHome />
        {t("home")}
      </MenuItem>
      <MenuItem
        key="/appMarket"
        onClick={() => {
          addRouterHistory("/appMarket");
          navigate("/appMarket");
        }}>
        <IconHome />
        {t("appMarket")}
      </MenuItem>
      <MenuItem
        key="/userCenter"
        onClick={() => {
          addRouterHistory("/userCenter");
          navigate("/userCenter");
        }}>
        <IconHome />
        {t("userCenter")}
      </MenuItem>
      {/* {menu.map((item) => {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                {item.icon}
                {item.title}
              </span>
            }>
            {item.children.map((child) => {
              return (
                <MenuItem key={child.key}>
                  <Link to={child.link}>
                    {child.icon}
                    {child.title}
                  </Link>
                </MenuItem>
              );
            })}
          </SubMenu>
        );
      })} */}
    </Menu>
  );

  return (
    <>
      <div className="flex items-center justify-start pl-4 h-16 border-b border-solid border-gray-20">
        <div className="logo h-8 w-8 rounded flex items-center justify-center flex-shrink-0">
          <IconFire className="text-2xl" style={{ color: "white" }} />
        </div>
        {!isCollapsed && <div className="title text-xl font-bold ml-2">HMOS App Store</div>}
      </div>
      {renderMenu}
    </>
  );
}

export default SideBar;
