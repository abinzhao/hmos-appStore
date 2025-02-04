import { useEffect, useState } from "react";
import { ConfigProvider, Layout } from "@arco-design/web-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import enUS from "@arco-design/web-react/es/locale/en-US";
import AppHeader from "./views/header";
import SideBar from "./views/sideBar";
import "./App.css";
import { useGlobalStore, useUserStore } from "./store";
import { userRequest } from "./http/api";

const Sider = Layout.Sider;
const Footer = Layout.Footer;
const Content = Layout.Content;

const collapsedWidth = 70;

function App() {
  const navigator = useNavigate();
  const { isCollapsed, setIsCollapsed, locale, siderWidth, setSiderWidth } = useGlobalStore();
  const { i18n } = useTranslation();
  const { setUser } = useUserStore();
  const [localeConfig, setLocaleConfig] = useState(zhCN);
  useEffect(() => {
    getUser();
  }, []);
  const { initializeUser } = useUserStore();

  useEffect(() => {
    // 初始化用户信息
    initializeUser();
  }, [initializeUser]);
  useEffect(() => {
    i18n.changeLanguage(locale);
    switch (locale) {
      case "zh":
        setLocaleConfig(zhCN);
        break;

      case "en":
        setLocaleConfig(enUS);
        break;

      default:
        setLocaleConfig(zhCN);
        break;
    }
  }, [locale]);
  const handleMoving = (_: any, { width }: { width: number }) => {
    if (width > collapsedWidth) {
      setSiderWidth(width);
      setIsCollapsed(!(width > collapsedWidth + 20));
    } else {
      setSiderWidth(collapsedWidth);
      setIsCollapsed(true);
    }
  };
  async function getUser() {
    if (localStorage.getItem("experience")) {
      setUser({
        id: "experience",
        username: "体验用户",
        email: "",
        avatar: "",
        role: "user",
        nickname: "",
        password: "",
        created_at: ""
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigator("/login");
      return;
    }

    try {
      const res = await userRequest.getCurrentUser();
      if (res.user) {
        setUser({
          id: res.user.id,
          username: res.user.username,
          email: res.user.email || "",
          avatar: res.user.avatar || "",
          role: res.user.user_role || "user",
          nickname: res.user.nickname,
          password: "",
          created_at: res.user.created_at,
        });
      }
    } catch (error) {
      console.error("Failed to get user info:", error);
      localStorage.removeItem("token");
      navigator("/login");
    }
  }
  return (
    <ConfigProvider locale={localeConfig}>
      <Layout className="h-screen">
        <Layout className="layout-collapse-demo">
          <Sider
            collapsed={isCollapsed}
            collapsible
            resizeBoxProps={{
              directions: ["right"],
              onMoving: handleMoving,
            }}
            collapsedWidth={collapsedWidth}
            width={siderWidth}
            trigger={null}
            breakpoint="xl">
            <SideBar></SideBar>
          </Sider>
          <Layout style={{ overflow: "hidden" }}>
            <AppHeader></AppHeader>
            <Layout style={{ padding: "20px" }}>
              <Content>
                <Outlet />
              </Content>
            </Layout>
            <Footer
              className="p-4 border-t border-solid border-gray-200 "
              style={{ backgroundColor: "var(--color-bg-3)" }}>
              <p>
                Copyright © 2025
                <a className="ml-2" href="https://github.com/gyjtiancai" target="__blank">
                  Abinzhao
                </a>
              </p>
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
