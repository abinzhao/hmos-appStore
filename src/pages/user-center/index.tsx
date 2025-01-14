import { useTranslation } from "react-i18next";
import { Descriptions, Card, Radio, List, Spin, Avatar } from "@arco-design/web-react";
import "./index.scss";
import { useEffect, useState } from "react";

function UserCenterPage() {
  const { t } = useTranslation();
  const [direction, setDirection] = useState("systemMessage");
  const [mockData, setMockData] = useState([]);
  const [scrollLoading, setScrollLoading] = useState<any>(<Spin loading={true} />);

  const fetchData = (currentPage: number) => {
    if (currentPage > 10) {
      setScrollLoading("No more data");
    } else {
      fetch("https://randomuser.me/api/?results=10")
        .then((res) => res.json())
        .then((data) => {
          setMockData((mockData) => mockData.concat(...data.results));
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const data = [
    {
      label: "姓名",
      value: "Socrates",
    },
    {
      label: "手机号",
      value: "123-1234-1234",
    },
    {
      label: "地址",
      value: "Beijing",
    },
    {
      label: "邮箱",
      value: "Beijing@gmail.com",
    },
    {
      label: "职业",
      value: "软件开发",
    },
  ];

  const messageData = [
    {
      label: t("systemMessage"),
      value: "systemMessage",
    },
    {
      label: t("softwareMessage"),
      value: "softwareMessage",
    },
    {
      label: t("userFeedback"),
      value: "userFeedback",
    },
  ];

  return (
    <div className="user-center-page">
      <Card className="user-info">
        <Descriptions colon=" :" layout="inline-horizontal" title={t("userInfo")} data={data} />
      </Card>
      <Card className="user-message">
        <Radio.Group
          type="button"
          name="direction"
          value={direction}
          onChange={setDirection}
          options={messageData}
        />
        <List
          style={{ maxHeight: 400 }}
          scrollLoading={scrollLoading}
          onReachBottom={(currentPage) => fetchData(currentPage)}
          bordered={false}
          dataSource={mockData}
          render={(item: any, index: number) => (
            <List.Item key={index} className="message-item">
              <List.Item.Meta
                avatar={
                  <Avatar shape="square">
                    <img alt="avatar" src={item.picture.thumbnail} />
                  </Avatar>
                }
                title={`${item.name.first} ${item.name.last}`}
                description={item.email}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default UserCenterPage;
