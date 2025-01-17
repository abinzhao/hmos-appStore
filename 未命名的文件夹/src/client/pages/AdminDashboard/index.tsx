import React from 'react';
import { Card } from 'antd';
import styles from './index.module.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <Card title="管理员面板">
        <p>管理员专用功能区域</p>
      </Card>
    </div>
  );
};

export default AdminDashboard;
