import { useTranslation } from "react-i18next";
import { Card, Grid, List, Statistic, Tabs } from "@arco-design/web-react";
import { IconArrowRise } from "@arco-design/web-react/icon";
import "./index.scss";
import { useEffect, useState } from "react";
import { appMarketRequest } from "../../http/api";

const Row = Grid.Row;
const Col = Grid.Col;

function HomePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("systemMessage");
  const [message, setMessage] = useState<any>({});

  const TabsData = [
    { title: t("systemMessage"), value: "systemMessage" },
    { title: t("softwareMessage"), value: "softwareMessage" },
    { title: t("userFeedback"), value: "userFeedback" },
  ];

  const getMessageList = async (type: string) => {
    setTab(type);
    const res = await appMarketRequest?.getMessageList(type);
    if (res?.length) {
      setMessage({ ...message, [type]: res || [] });
    }
  };

  useEffect(() => {
    getMessageList(tab);
  }, []);

  return (
    <div className="home-page">
      <Row gutter={20} className={"mb-4"}>
        <Col span={24} className={"text-xl font-bold"}>
          {t("welcomeHMOSAppStore")}
        </Col>
      </Row>
      <Row gutter={20} className={"mb-4"}>
        <Col span={24}>{t("programmingDesc")}</Col>
      </Row>
      <Card
        hoverable
        style={{
          borderRadius: "12px",
        }}>
        <Row>
          <Statistic
            title={t("appTotal")}
            value={192393}
            suffix={<IconArrowRise style={{ color: "#ee4d38" }} />}
            style={{ marginRight: 60, marginBottom: 20 }}
          />
          <Statistic
            title={t("totalInstallations")}
            value={192393}
            suffix={<IconArrowRise style={{ color: "#ee4d38" }} />}
            style={{ marginRight: 60, marginBottom: 20 }}
          />
        </Row>
      </Card>
      <Row gutter={20} className={"mb-4"} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card
            className="flex flex-col items-center"
            hoverable
            style={{
              borderRadius: "12px",
              height: "100%",
            }}>
            <Tabs type="capsule" size="default" activeTab={tab} onChange={getMessageList}>
              {TabsData?.map((item) => (
                <Tabs.TabPane key={item.value} title={item.title}>
                  <List
                    scrollLoading={false}
                    // onReachBottom={(currentPage) => fetchData(currentPage)}
                    dataSource={message[item.value] || []}
                    render={(item, index) => (
                      <List.Item key={index}>
                        <List.Item.Meta
                          title={`${item.name.first} ${item.name.last}`}
                          description={item.email}
                        />
                      </List.Item>
                    )}
                  />
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Card>
        </Col>
        {/* <Col span={12}>
          <Card
            className="flex flex-col justify-center items-center"
            hoverable
            style={{
              borderRadius: "12px",
            }}>
            {t("programmingDesc")}
          </Card>
        </Col> */}
      </Row>
    </div>
  );
}

export default HomePage;
