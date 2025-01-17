import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import PageHeader from '../../components/PageHeader';
import styles from './index.module.css';

const { TabPane } = Tabs;

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleUpdateProfile = async (values: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userAPI.updateUser(user.id, values);
      updateUser({ ...user, ...values });
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (values: any) => {
    if (!user) return;

    setLoading(true);
    try {
      await userAPI.updateUser(user.id, {
        currentPassword: values.currentPassword,
        password: values.newPassword,
      });
      message.success('密码修改成功');
      form.resetFields();
    } catch (error) {
      message.error('密码修改失败，请确认当前密码是否正确');
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = (_: any, value: string) => {
    const password = form.getFieldValue('newPassword');
    if (value && value !== password) {
      return Promise.reject('两次输入的密码不一致');
    }
    return Promise.resolve();
  };

  return (
    <div className={styles.container}>
      <PageHeader title="个人信息" />
      <Card>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="基本信息" key="profile">
            <Form
              layout="vertical"
              initialValues={{
                username: user?.username,
                email: user?.email,
              }}
              onFinish={handleUpdateProfile}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  更新信息
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="修改密码" key="password">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdatePassword}
            >
              <Form.Item
                label="当前密码"
                name="currentPassword"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="新密码"
                name="newPassword"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="确认新密码"
                name="confirmPassword"
                rules={[
                  { required: true, message: '请确认新密码' },
                  { validator: validateConfirmPassword }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile;
