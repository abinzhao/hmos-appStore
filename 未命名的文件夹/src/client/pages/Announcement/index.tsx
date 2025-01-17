import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Popconfirm, 
  Typography 
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { announcementAPI, AnnouncementData } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import { formatDate } from '../../utils/format';
import styles from './index.module.css';

const { TextArea } = Input;
const { Paragraph } = Typography;

const Announcement: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementData | null>(null);
  const [form] = Form.useForm();

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementAPI.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      message.error('获取公告列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      if (editingAnnouncement) {
        await announcementAPI.updateAnnouncement(editingAnnouncement.id!, values);
        message.success('公告更新成功');
      } else {
        await announcementAPI.createAnnouncement(values);
        message.success('公告发布成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchAnnouncements();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await announcementAPI.deleteAnnouncement(id);
      message.success('删除成功');
      fetchAnnouncements();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className={styles.container}>
      <PageHeader
        title="系统公告"
        extra={isAdmin ? [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingAnnouncement(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            发布公告
          </Button>
        ] : undefined}
      />

      <List
        className={styles.list}
        loading={loading}
        itemLayout="vertical"
        dataSource={announcements}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={isAdmin ? [
              <Button
                key="edit"
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingAnnouncement(item);
                  form.setFieldsValue(item);
                  setModalVisible(true);
                }}
              >
                编辑
              </Button>,
              <Popconfirm
                key="delete"
                title="确定要删除这条公告吗？"
                onConfirm={() => handleDelete(item.id!)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            ] : undefined}
          >
            <Card className={styles.card}>
              <List.Item.Meta
                title={
                  <div className={styles.title}>
                    <h3>{item.title}</h3>
                    <span className={styles.date}>
                      {formatDate(item.createdAt!)}
                    </span>
                  </div>
                }
              />
              <Paragraph className={styles.content}>
                {item.content}
              </Paragraph>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingAnnouncement ? '编辑公告' : '发布公告'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingAnnouncement(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="公告标题"
            rules={[
              { required: true, message: '请输入公告标题' },
              { max: 100, message: '标题不能超过100个字符' }
            ]}
          >
            <Input placeholder="请输入公告标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="公告内容"
            rules={[
              { required: true, message: '请输入公告内容' },
              { max: 2000, message: '内容不能超过2000个字符' }
            ]}
          >
            <TextArea
              rows={6}
              placeholder="请输入公告内容"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item className={styles.modalFooter}>
            <Button 
              type="primary" 
              htmlType="submit"
            >
              {editingAnnouncement ? '更新' : '发布'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Announcement;
