import { useTranslation } from "react-i18next";
import { Button, Card, Empty, List, Message, Spin, Tabs, Select } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import AppItemCard from "./item-card";
import appMarketRequest from "../../http/api/app-market";
import { IconShareExternal } from "@arco-design/web-react/icon";
import { useNavigate } from "react-router-dom";
import { appCategory } from "../edit-app/contants";
import { APP_404 } from "../../assets/common";
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const style: React.CSSProperties = {
  textAlign: "center",
};

function AppMarketPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("3");
  const [category, setCategory] = useState<string>("");
  const [mockData, setMockData] = useState([]);
  const [loading, setLoading] = useState(false);

  const TabsData = [
    { title: t("alreadyOnShelves"), value: "3" },
    { title: t("pendingListing"), value: "2" },
    { title: t("underReview"), value: "1" },
  ];

  const getApplist = async (tab: string) => {
    try {
      setLoading(true);
      const params: any = {
        application_status: tab,
      };
      if (category) {
        params["category"] = JSON.stringify(category); // 添加分类作为请求参数
      }
      const res = await appMarketRequest.getApplist(params);
      setMockData(res);
    } catch (error: any) {
      console.log(error);
      Message.error(error?.message || t("APIerror"));
      setMockData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplist(tab);
  }, [tab, category]); // 现在也监听 category 变化

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
        <Button
          type="primary"
          icon={<IconShareExternal />}
          onClick={() => {
            navigate("/editApp");
          }}>
          {t("submitSoftware")}
        </Button>
        <Select
          style={{ width: "200px", marginBottom: "16px" }}
          placeholder={t("selectCategory")}
          onChange={setCategory}
          defaultValue="">
          <Option value="">全部</Option>
          {appCategory.map((cat) => (
            <Option key={cat.value} value={cat.value}>
              {cat.label}
            </Option>
          ))}
        </Select>
        <Tabs
          tabPosition="top"
          animation
          justify
          style={style}
          type="capsule"
          size="large"
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
                    <Empty imgSrc={APP_404} description={t("noPage")} />
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