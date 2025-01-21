import { useTranslation } from "react-i18next";
import { Descriptions, Card, Radio, List, Spin, Avatar, Form, Input, Modal, Button, Message } from "@arco-design/web-react";
import "./index.scss";
import { useEffect, useState } from "react";
import { appMessageRequest, systemMessageRequest, userRequest } from "../../http/api";
import { useUserStore } from "../../store";
import Col from "@arco-design/web-react/es/Grid/col";
import Row from "@arco-design/web-react/es/Grid/row";
import { frontBaseURL } from "../../http/instance";

function UserCenterPage() {
  const { t } = useTranslation();
  const [direction, setDirection] = useState("systemMessage");
  const [mockData, setMockData] = useState([]);
  const [scrollLoading, setScrollLoading] = useState<any>(<Spin loading={true} />);
  const [formData, setFormData] = useState(useUserStore.getState().user);
  const [userInfo, setUserInfo] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchData = (currentPage: number) => {
    if (direction === "systemMessage") {
      systemMessageRequest.getSystemMessages({
        page: currentPage,
        pageSize: 10,
      }).then((res) => {
        // Extract the new messages from the response
        const newMessages = res.data.sysMessage || [];

        // Filter out any messages that already exist in mockData based on their id
        const filteredNewMessages = newMessages.filter((newMsg: { id: any; }) =>
          !mockData.some(existingMsg => existingMsg.id === newMsg.id)
        );

        // Update the state with the new filtered messages
        setMockData((prevMockData) => [...prevMockData, ...filteredNewMessages]);
        if (res.data.sysMessage.length < 10) {
          setScrollLoading("No more data");
        } else {
          setScrollLoading("下拉获取更多数据");
        }
      })
    } else if (direction === "softwareMessage") {
      appMessageRequest.getMyMessages({
        page: currentPage,
        pageSize: 10,
      }).then((res) => {
        // Extract the new messages from the response
        const newMessages = res.data.messages || [];

        // Filter out any messages that already exist in mockData based on their id
        const filteredNewMessages = newMessages.filter((newMsg: { id: any; }) =>
          !mockData.some(existingMsg => existingMsg.id === newMsg.id)
        );

        // Update the state with the new filtered messages
        setMockData((prevMockData) => [...prevMockData, ...filteredNewMessages]);
        if (res.data.messages.length < 10) {
          setScrollLoading("No more data");
        } else {
          setScrollLoading("下拉获取更多数据");
        }
      })
    } else if (direction === "userFeedback") {
      appMessageRequest.getUserFeedbackMessages({
        page: currentPage,
        pageSize: 10,
      }).then((res) => {
        // Extract the new messages from the response
        const newMessages = res.data.messages || [];

        // Filter out any messages that already exist in mockData based on their id
        const filteredNewMessages = newMessages.filter((newMsg: { id: any; }) =>
          !mockData.some(existingMsg => existingMsg.id === newMsg.id)
        );

        // Update the state with the new filtered messages
        setMockData((prevMockData) => [...prevMockData, ...filteredNewMessages]);
        if (res.data.messages.length < 10) {
          setScrollLoading("No more data");
        } else {
          setScrollLoading("下拉获取更多数据");
        }
      })
    }
  };
  const handleInputChange = (value, e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Save updated user information
  const handleSubmit = async () => {
    useUserStore.setState({ user: formData });
    await userRequest.editUser(formData);
    setUserInfo([
      { label: "昵称", value: useUserStore.getState().user.nickname },
      { label: "用户名", value: useUserStore.getState().user.username },
      { label: "邮箱", value: useUserStore.getState().user.email },
      { label: "角色", value: useUserStore.getState().user.role },
      { label: "创建时间", value: useUserStore.getState().user.created_at },
    ]);
    Message.success(t("消息更新成功"));
    setIsEditModalVisible(false); // Close the modal after submitting
  };

  // Cancel editing and close the modal
  const handleCancel = () => {
    // Optionally reset form data to original values before closing
    setFormData(useUserStore.getState().user);
    setIsEditModalVisible(false);
  };


  useEffect(() => {
    setMockData([]);
    fetchData(1);
  }, [direction])

  useEffect(() => {
    fetchData(1);
    // Initialize user info when component mounts
    useUserStore.getState().initializeUser();
    setFormData(useUserStore.getState().user);

    setUserInfo([
      { label: "昵称", value: useUserStore.getState().user.nickname },
      { label: "用户名", value: useUserStore.getState().user.username },
      { label: "邮箱", value: useUserStore.getState().user.email },
      { label: "角色", value: useUserStore.getState().user.role },
      { label: "创建时间", value: useUserStore.getState().user.created_at },
    ])
  }, []);

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
        <Descriptions colon=":" layout="inline-horizontal" title={t("userInfo")} data={userInfo} />
        <Button type="primary" onClick={() => setIsEditModalVisible(true)} style={{ marginTop: '16px' }}>
          {t("editUserInfo")}
        </Button>
      </Card>
      {/* Edit User Info Modal */}
      <Modal
        title={t("editUserInfo")}
        visible={isEditModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={t("save")}
        cancelText={t("cancel")}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={t("nickname")}>
                <Input name="nickname" value={formData.nickname} onChange={handleInputChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("email")}>
                <Input name="email" value={formData.email} onChange={handleInputChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t("avatar")}>
                <Input name="avatar" value={formData.avatar} onChange={handleInputChange} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Messages section remains unchanged... */}
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

              {(direction === "systemMessage" || direction==="userFeedback") ? (
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
      </Card>
    </div>
  );
}

export default UserCenterPage;
