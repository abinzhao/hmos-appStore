import { useTranslation } from "react-i18next";

function Page3() {
  const { t } = useTranslation();
  return <div>{t("页面三")}</div>;
}

export default Page3;
