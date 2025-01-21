import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Message, Input, Button } from "@arco-design/web-react";
import { IconUser, IconLock, IconEmail } from "@arco-design/web-react/icon";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import enUS from "@arco-design/web-react/es/locale/en-US";
import { useGlobalStore } from "../store";
import { userRequest } from "../http/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { theme, locale } = useGlobalStore();
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

  async function register() {
    const { data, message } = await userRequest.register({ email, username, password });
    Message.success(message);
    navigate("/login");
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
          <img className="w-72 mr-4" src="/src/assets/image/cat.png" />
          <div>
            <div className="flex items-center justify-center border-gray-20">
              <div className="h-12 w-12 rounded flex items-center justify-center flex-shrink-0">
                <img className="text-2xl" src="./src/assets/image/hmos-logo.png" />
              </div>
              <div className="title text-2xl font-bold ml-4">HMOS 应用商店</div>
            </div>
            <div className="mt-8 w-72">
              <Input
                value={email}
                onChange={(v) => {
                  setEmail(v);
                }}
                size="large"
                prefix={<IconEmail />}
                allowClear
                placeholder={t("inputEmail")}
              />
            </div>
            <div className="mt-5 w-72">
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
            <div className="flex items-center justify-between mt-8">
              <Button type="outline" size="large" onClick={experience}>
                {t("oneClickExperience")}
              </Button>
              <Button type="outline" size="large" onClick={() => navigate("/login")}>
                {t("returnToLogin")}
              </Button>
              <Button type="primary" size="large" onClick={register}>
                {t("register")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Login;
