import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  message,
  Image,
  Space,
  Divider,
  Modal,
} from 'antd';
import {
  DownloadOutlined,
  AndroidOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { appAPI, CommentData } from '../../services/api';
import CommentList from '../../components/CommentList';
import CommentForm from '../../components/CommentForm';
import styles from './index.module.css';

const AppDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<any>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [installModalVisible, setInstallModalVisible] = useState(false);

  const fetchAppDetails = async () => {
    setLoading(true);
    try {
      const appData = await appAPI.getAppDetails(Number(id));
      setApp(appData);
    } catch (error) {
      message.error('获取应用详情失败');
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    try {
      const commentsData = await appAPI.getAppComments(Number(id));
      setComments(commentsData);
    } catch (error) {
      message.error('获取评论失败');
    }
  };

  useEffect(() => {
    if (id) {
      fetchAppDetails();
      fetchComments();
    }
  }, [id]);

  const handleDownload = async () => {
    try {
      await appAPI.incrementDownload(Number(id));
      // 实际的下载逻辑...
      window.open(`/api/download${app.packageUrl}`);
    } catch (error) {
      message.error('下载失败');
    }
  };

  const handleInstall = async () => {
    try {
      const response = await appAPI.installApp(Number(id));
      if (response.success) {
        message.success('安装指令已发送');
      } else {
        message.error('安装失败');
      }
    } catch (error) {
      message.error('安装失败');
    }
    setInstallModalVisible(false);
  };

  const handleComment = async (content: string) => {
    setCommentLoading(true);
    try {
      await appAPI.addComment(Number(id), content);
      message.success('评论成功');
      fetchComments();
    } catch (error) {
      message.error('评论失败');
    }
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await appAPI.deleteComment(Number(id), commentId);
      message.success('删除成功');
      fetchComments();
    } catch (error) {
      message.error('删除失败');
    }
  };

  if (loading || !app) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <Image
            width={100}
            src={app.iconUrl}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABqSURBVHic7cExAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA08pgABKXAN1gAAAABJRU5ErkJggg=="
          />
          <div className={styles.info}>
            <h1>{app.name}</h1>
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
              >
                下载
              </Button>
              <Button
                icon={<AndroidOutlined />}
                onClick={() => setInstallModalVisible(true)}
              >
                安装到设备
              </Button>
            </Space>
          </div>
        </div>

        <Divider />

        <Descriptions title="应用信息" column={2}>
          <Descriptions.Item label="版本">{app.version}</Descriptions.Item>
          <Descriptions.Item label="分类">
            <Space>
              <AppstoreOutlined />
              {app.category}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="下载次数">{app.downloads}</Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(app.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <h3>应用描述</h3>
        <p>{app.description}</p>

        <Divider />

        <h3>应用截图</h3>
        <div className={styles.screenshots}>
          {app.screenshots?.map((url: string, index: number) => (
            <Image
              key={index}
              width={200}
              src={url}
              className={styles.screenshot}
            />
          ))}
        </div>

        <Divider />

        <h3>用户评论</h3>
        <div className={styles.comments}>
          <CommentForm onSubmit={handleComment} loading={commentLoading} />
          <CommentList
            comments={comments}
            currentUserId={app.currentUserId}
            onDelete={handleDeleteComment}
          />
        </div>
      </Card>

      <Modal
        title="安装到设备"
        open={installModalVisible}
        onOk={handleInstall}
        onCancel={() => setInstallModalVisible(false)}
      >
        <p>确定要将应用安装到已连接的设备吗？</p>
      </Modal>
    </div>
  );
};

export default AppDetail;
