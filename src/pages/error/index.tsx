import { useRouteError } from "react-router-dom";
import { Empty } from "@arco-design/web-react";
import { useTranslation } from "react-i18next";
import "./index.css";
import { APP_404 } from "../../assets/common";
function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-screen">
      <Empty imgSrc={APP_404} description={t("noPage")} />
    </div>
  );
}

export default ErrorPage;
