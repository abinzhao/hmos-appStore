import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Input, Button, Message } from "@arco-design/web-react";
import { IconUser, IconLock } from "@arco-design/web-react/icon";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import enUS from "@arco-design/web-react/es/locale/en-US";
import { useGlobalStore, useUserStore } from "../../store";
import { userRequest } from "../../http/api";
import { PAGE_LOGO, PAGE_LOGO_ALT, PAGE_TITLE } from "../../assets/common";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { theme, locale } = useGlobalStore();
  const { setUser } = useUserStore();
  function toggleTheme() {
    theme.map((x, i) => {
      document.body.style.setProperty("--primary-" + (i + 1), x);
    });
  }
  const { i18n, t } = useTranslation();
  const [localeConfig, setLocaleConfig] = useState(zhCN);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/home");
    toggleTheme();
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
  }, []);

  async function login() {
    try {
      const res = await userRequest.login({ username, password });
      if (res) {
        const token = `Bearer ${res.token}`;
        localStorage.setItem("token", token);
        // 设置用户信息到 store
        setUser({
          id: res.user.id,
          nickname: res.user.nickname,
          username: res.user.username,
          email: res.user.email || "",
          created_at: res.user.created_at || "",
          avatar: res.user.avatar || "",
          role: res.user.user_role || "user",
          password: "",
        });

        Message.success("登录成功");
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      Message.error("登录失败，请检查用户名和密码");
    }
  }
  async function experience() {
    localStorage.setItem("experience", "true");
    navigate("/home");
    userRequest.experience();
  }
  return (
    <ConfigProvider locale={localeConfig}>
      <div
        style={{ background: "linear-gradient(135deg, #e0f7fa, #ffffff)" }}
        className="w-full h-full flex items-center justify-center">
        <div className="max-w-3xl min-w-80 shadow-2xl p-8 flex items-center">
          <img className="w-72 mr-4" src={PAGE_LOGO_ALT} />
          <div>
            <div className="flex items-center justify-center border-gray-20">
              <div className="h-12 w-12 rounded flex items-center justify-center flex-shrink-0">
                <img className="text-2xl" src={PAGE_LOGO} />
              </div>
              <div className="title text-2xl font-bold ml-4">{PAGE_TITLE}</div>
            </div>
            <div className="mt-8 w-72">
              <Input
                value={username}
                onChange={(v) => {
                  setUsername(v);
                }}
                size="large"
                prefix={<IconUser />}
                allowClear
                placeholder={t("inputUserName")}
              />
            </div>
            <div className="mt-5 w-72">
              <Input.Password
                value={password}
                onChange={(v) => {
                  setPassword(v);
                }}
                size="large"
                prefix={<IconLock />}
                allowClear
                placeholder={t("inputPassword")}
              />
            </div>
            <div className="flex items-center justify-center mt-8">
              <Button
                className={"mr-4"}
                hidden={location.hostname === "localhost"}
                type="outline"
                size="large"
                onClick={experience}>
                {t("oneClickExperience")}
              </Button>
              <Button
                className={"mr-4"}
                type="outline"
                size="large"
                onClick={() => navigate("/register")}>
                {t("register")}
              </Button>
              <Button type="primary" size="large" onClick={login}>
                {t("login")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default LoginPage;
