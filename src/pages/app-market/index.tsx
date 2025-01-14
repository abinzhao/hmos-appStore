import { useTranslation } from "react-i18next";
import { Card, Empty, List, Message, Spin, Tabs } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import NotFoundPng from "../../assets/image/404.png";
import AppItemCard from "./item-card";
import appMarketRequest from "../../http/api/app-market";

const TabPane = Tabs.TabPane;

const style: React.CSSProperties = {
  textAlign: "center",
};

function AppMarketPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("alreadyOnShelves");
  const TabsData = [
    { title: t("alreadyOnShelves"), value: "alreadyOnShelves" },
    { title: t("pendingListing"), value: "pendingListing" },
    { title: t("underReview"), value: "underReview" },
  ];

  const [mockData, setMockData] = useState([]);
  const [loading, setLoading] = useState<any>(false);

  const getApplist = async (tab: string) => {
    try {
      setLoading(true);
      const res = await appMarketRequest.getApplist(tab);
      setMockData(res);
    } catch (error: any) {
      Message.error(error?.message || t("APIerror"));
      setMockData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getApplist(tab);
  }, []);

  return (
    <div className="app-market-page">
      <Card
        hoverable
        style={{
          width: "100%",
          height: "calc(100vh - 155px)",
          overflow: "auto",
          borderRadius: "12px",
        }}>
        <Tabs
          tabPosition="top"
          animation
          justify
          style={style}
          type="capsule"
          activeTab={tab}
          onChange={(value) => setTab(value)}>
          {TabsData.map((item) => (
            <TabPane key={item.value} title={item.title}>
              {mockData?.length <= 0 ? (
                <div
                  className="flex items-center justify-center"
                  style={{ width: "100%", height: "calc(100vh - 155px)" }}>
                  {loading ? (
                    <Spin dot loading />
                  ) : (
                    <Empty imgSrc={NotFoundPng} description={t("noPage")} />
                  )}
                </div>
              ) : (
                <List
                  grid={{ gutter: 0, span: 6 }}
                  dataSource={mockData}
                  bordered={false}
                  render={(item, index) => (
                    <List.Item key={index}>
                      <AppItemCard data={item} />
                    </List.Item>
                  )}
                />
              )}
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}

export default AppMarketPage;
