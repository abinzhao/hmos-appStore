import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "../../store";

function RouterTabs() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { routerHistory, delRouterHistory } = useGlobalStore();
  const [activeTab, setActiveTab] = useState(routerHistory[0] ?? "");
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  const handleDeleteTab = (key: string) => {
    const len = routerHistory.length;
    const history = routerHistory;
    const index = history.indexOf(key);
    delRouterHistory(key);
    history.splice(index, 1);
    if (location.pathname === key && len > 1) {
      if (history.length > index) {
        navigate(history[index]);
        setActiveTab(history[index]);
      } else {
        navigate(history[index - 1]);
        setActiveTab(history[index - 1]);
      }
    }
  };
  return (
    <div
      className="p-4 border-b border-solid border-gray-200"
      style={{ backgroundColor: "var(--color-bg-3)" }}>
      {/* <Tabs
        type="card-gutter"
        editable
        onClickTab={(key) => navigate(key)}
        activeTab={activeTab}
        onDeleteTab={handleDeleteTab}>
        {routerHistory.map((pathname) => (
          <TabPane destroyOnHide key={pathname} title={t(routerNameMap[pathname])}></TabPane>
        ))}
      </Tabs> */}
    </div>
  );
}

export default RouterTabs;
