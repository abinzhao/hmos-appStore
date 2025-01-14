import { useTranslation } from "react-i18next";
import { Empty } from "@arco-design/web-react";
function AppMarketPage() {
  const { t } = useTranslation();
  return (
    <div>
      <Empty></Empty>
      {t("appMarket")}
    </div>
  );
}

export default AppMarketPage;
