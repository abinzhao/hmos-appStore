import { useTranslation } from "react-i18next";
function Page4() {
  const { t } = useTranslation();
  return <div>{t("页面四")}</div>;
}

export default Page4;
