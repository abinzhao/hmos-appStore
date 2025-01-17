import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Tag,
  Tooltip,
  Image,
  Badge,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { appAPI, AppData } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import SearchForm from '../../components/SearchForm';
import AppForm from './components/AppForm';
import { formatDate, formatFileSize } from '../../utils/format';
import styles from './index.module.css';

const AppList: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<AppData | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await appAPI.getApps();
      setApps(data);
    } catch (error) {
      message.error('获取应用列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleSearch = async (values: any) => {
    setLoading(true);
    try {
      const data = await appAPI.getApps(values);
      setApps(data);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: AppData) => {
    try {
      if (editingApp) {
        await appAPI.updateApp(editingApp.id!, values);
        message.success('更新成功');
      } else {
        await appAPI.createApp(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchApps();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await appAPI.deleteApp(id);
      message.success('删除成功');
      fetchApps();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '应用',
      key: 'app',
      render: (record: AppData) => (
        <div className={styles.appInfo}>
          {record.iconUrl && (
            <Image
              src={record.iconUrl}
              alt={record.name}
              className={styles.appIcon}
              preview={false}
            />
          )}
          <div>
            <Link to={`/apps/${record.id}`} className={styles.appName}>
              {record.name}
            </Link>
            <div className={styles.appVersion}>v{record.version}</div>
          </div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const categoryMap: Record<string, { color: string; text: string }> = {
          game: { color: 'magenta', text: '游戏' },
          tool: { color: 'blue', text: '工具' },
          social: { color: 'green', text: '社交' },
          education: { color: 'orange', text: '教育' },
          entertainment: { color: 'purple', text: '娱乐' },
          other: { color: 'default', text: '其他' },
        };
        const { color, text } = categoryMap[category] || categoryMap.other;
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { status: 'success' | 'error' | 'warning'; text: string }> = {
          active: { status: 'success', text: '已上架' },
          inactive: { status: 'error', text: '已下架' },
          pending: { status: 'warning', text: '待上架' },
        };
        const { status: badgeStatus, text } = statusMap[status];
        return <Badge status={badgeStatus} text={text} />;
      },
    },
    {
      title: '下载量',
      dataIndex: 'downloads',
      key: 'downloads',
      sorter: (a: AppData, b: AppData) => (a.downloads || 0) - (b.downloads || 0),
      render: (downloads: number) => (
        <span>
          <DownloadOutlined /> {downloads || 0}
        </span>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: AppData) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => setSelectedApp(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingApp(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id!)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const searchFields = [
    {
      name: 'name',
      label: '应用名称',
      type: 'input',
    },
    {
      name: 'category',
      label: '分类',
      type: 'select',
      options: [
        { label: '游戏', value: 'game' },
        { label: '工具', value: 'tool' },
        { label: '社交', value: 'social' },
        { label: '教育', value: 'education' },
        { label: '娱乐', value: 'entertainment' },
        { label: '其他', value: 'other' },
      ],
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '已上架', value: 'active' },
        { label: '已下架', value: 'inactive' },
        { label: '待上架', value: 'pending' },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader
        title="应用管理"
        extra={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingApp(null);
              setModalVisible(true);
            }}
          >
            新增应用
          </Button>,
        ]}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} />

      <Table
        columns={columns}
        dataSource={apps}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingApp ? '编辑应用' : '新增应用'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingApp(null);
        }}
        width={800}
        footer={null}
      >
        <AppForm
          initialValues={editingApp || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalVisible(false);
            setEditingApp(null);
          }}
        />
      </Modal>

      <Modal
        title="应用详情"
        open={!!selectedApp}
        onCancel={() => setSelectedApp(null)}
        footer={null}
        width={800}
      >
        {selectedApp && (
          <div className={styles.appDetail}>
            {/* 应用详情内容 */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppList;
