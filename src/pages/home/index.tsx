import { useTranslation } from "react-i18next";
import { Avatar, Card, Grid, List, Spin, Tabs } from "@arco-design/web-react";
import "./index.scss";
import { useEffect, useState } from "react";
import { appMarketRequest, appMessageRequest, systemMessageRequest } from "../../http/api";
import { frontBaseURL } from "../../http/instance";
import Overview from "./overview";

const Row = Grid.Row;
const Col = Grid.Col;

function HomePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("systemMessage");
  const [message, setMessage] = useState<any>([]);
  const [scrollLoading, setScrollLoading] = useState<any>(<Spin loading={true} />);
  const [direction, setDirection] = useState("systemMessage");
  const [appTotal, setAppTotal] = useState<number>(0);
  const [totalInstallations, setTotalInstallations] = useState<number>(0);

  const TabsData = [
    { title: t("systemMessage"), value: "systemMessage" },
    { title: t("softwareMessage"), value: "softwareMessage" },
    { title: t("userFeedback"), value: "userFeedback" },
  ];

  const fetchData = (currentPage: number) => {
    if (direction === "systemMessage") {
      systemMessageRequest
        .getSystemMessages({
          page: currentPage,
          pageSize: 10,
        })
        .then((res) => {
          // 从响应中提取新消息
          const newMessages = res.data.sysMessage || [];

          // 根据消息 ID 过滤掉消息中已存在的所有消息
          const filteredNewMessages = newMessages.filter(
            (newMsg: { id: any }) =>
              !message.some((existingMsg: { id: any }) => existingMsg.id === newMsg.id)
          );

          // 使用新过滤的消息更新状态
          setMessage((prevMessage: any[]) => [...prevMessage, ...filteredNewMessages]);
          if (res.data.sysMessage.length < 10) {
            setScrollLoading("No more data");
          } else {
            setScrollLoading("下拉获取更多数据");
          }
        })
        .catch(() => {
          setScrollLoading("No more data");
        });
    } else if (direction === "softwareMessage") {
      appMessageRequest
        .getMyMessages({
          page: currentPage,
          pageSize: 10,
        })
        .then((res) => {
          // Extract the new messages from the response
          const newMessages = res.data.messages || [];

          // Filter out any messages that already exist in message based on their id
          const filteredNewMessages = newMessages.filter(
            (newMsg: { id: any }) =>
              !message.some((existingMsg: { id: any }) => existingMsg.id === newMsg.id)
          );

          // Update the state with the new filtered messages
          setMessage((prevMessage: any[]) => [...prevMessage, ...filteredNewMessages]);
          if (res.data.messages.length < 10) {
            setScrollLoading("No more data");
          } else {
            setScrollLoading("下拉获取更多数据");
          }
        })
        .catch(() => {
          setScrollLoading("No more data");
        });
    } else if (direction === "userFeedback") {
      appMessageRequest
        .getUserFeedbackMessages({
          page: currentPage,
          pageSize: 10,
        })
        .then((res) => {
          // Extract the new messages from the response
          const newMessages = res.data.messages || [];

          // Filter out any messages that already exist in message based on their id
          const filteredNewMessages = newMessages.filter(
            (newMsg: { id: any }) =>
              !message.some((existingMsg: { id: any }) => existingMsg.id === newMsg.id)
          );

          // Update the state with the new filtered messages
          setMessage((prevMessage: any[]) => [...prevMessage, ...filteredNewMessages]);
          if (res.data.messages.length < 10) {
            setScrollLoading("No more data");
          } else {
            setScrollLoading("下拉获取更多数据");
          }
        })
        .catch(() => {
          setScrollLoading("No more data");
        });
    }
  };

  const getMessageList = (e: string) => {
    setDirection(e);
    setTab(e);
  };

  const fetchTotalInfo = async () => {
    const appTotalObj = await appMarketRequest.getAppTotal();
    const appTotal = appTotalObj.appCount || 0;
    const appInstallTotalObj = await appMarketRequest.getAppInstallTotal();
    const appInstallTotal = appInstallTotalObj.appInstallCount || 0;
    setAppTotal(appTotal);
    setTotalInstallations(appInstallTotal);
  };

  useEffect(() => {
    setMessage([]);
    fetchData(1);
  }, [direction]);

  useEffect(() => {
    fetchData(1);
    fetchTotalInfo();
  }, []);

  return (
    <div className="home-page">
      <Overview appTotal={appTotal} totalInstallations={totalInstallations} />
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
                    style={{ maxHeight: 400 }}
                    scrollLoading={scrollLoading}
                    onReachBottom={(currentPage) => fetchData(currentPage)}
                    bordered={false}
                    dataSource={message || []}
                    render={(item: any, index: number) => (
                      <List.Item key={index} className="message-item">
                        {direction === "systemMessage" || direction === "userFeedback" ? (
                          <List.Item.Meta
                            avatar={
                              <Avatar shape="square">
                                <img alt="avatar" src={item.avatar} />
                              </Avatar>
                            }
                            title={`${item.nickname}`}
                            description={item.message_text}
                          />
                        ) : (
                          <List.Item.Meta
                            avatar={
                              <Avatar shape="square">
                                <img alt="avatar" src={`${frontBaseURL}/${item.app_icon}`} />
                              </Avatar>
                            }
                            title={`${item.app_package_name} - ${item.app_name}`}
                            description={item.message_text}
                          />
                        )}
                      </List.Item>
                    )}
                  />
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
