import { useTranslation } from "react-i18next";
import { Empty } from "@arco-design/web-react";
function UserCenterPage() {
  const { t } = useTranslation();
  return (
    <div>
      <Empty></Empty>
      {t("userCenter")}
    </div>
  );
}

export default UserCenterPage;
