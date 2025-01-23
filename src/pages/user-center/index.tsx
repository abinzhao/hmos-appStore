import { useTranslation } from "react-i18next";
import { Descriptions, Card, Form, Input, Modal, Button, Message } from "@arco-design/web-react";
import "./index.scss";
import { useEffect, useState } from "react";
import { userRequest } from "../../http/api";
import { useUserStore } from "../../store";
import Col from "@arco-design/web-react/es/Grid/col";
import Row from "@arco-design/web-react/es/Grid/row";

function UserCenterPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(useUserStore.getState().user);
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleInputChange = (value: any, e: any) => {
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
    // Initialize user info when component mounts
    useUserStore.getState().initializeUser();
    setFormData(useUserStore.getState().user);

    setUserInfo([
      { label: "昵称", value: useUserStore.getState().user.nickname },
      { label: "用户名", value: useUserStore.getState().user.username },
      { label: "邮箱", value: useUserStore.getState().user.email },
      { label: "角色", value: useUserStore.getState().user.role },
      { label: "创建时间", value: useUserStore.getState().user.created_at },
    ]);
  }, []);

  return (
    <div className="user-center-page">
      <Card className="user-info">
        <Descriptions colon=":" layout="inline-horizontal" title={t("userInfo")} data={userInfo} />
        <Button
          type="primary"
          onClick={() => setIsEditModalVisible(true)}
          style={{ marginTop: "16px" }}>
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
        cancelText={t("cancel")}>
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
    </div>
  );
}

export default UserCenterPage;
