import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List } from 'antd';
import {
  AppstoreOutlined,
  UserOutlined,
  DownloadOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { appAPI, AnnouncementData } from '../../services/api';
import styles from './index.module.css';

interface Statistics {
  totalApps: number;
  totalUsers: number;
  totalDownloads: number;
  totalComments: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics>({
    totalApps: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalComments: 0,
  });
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, announcementsData] = await Promise.all([
        appAPI.getStatistics(),
        appAPI.getAnnouncements(),
      ]);
      setStatistics(statsData);
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className={styles.container}>
      <Row gutter={24}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="应用总数"
              value={statistics.totalApps}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="用户总数"
              value={statistics.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="总下载量"
              value={statistics.totalDownloads}
              prefix={<DownloadOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="总评论数"
              value={statistics.totalComments}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="最新公告"
        className={styles.announcements}
        loading={loading}
      >
        <List
          dataSource={announcements}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.content}
              />
              <div className={styles.date}>
                {new Date(item.createdAt!).toLocaleString()}
              </div>
            </List.Item>
          )}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
