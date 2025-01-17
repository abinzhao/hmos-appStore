import React from 'react';
import { Button, Space } from 'antd';
import styles from './index.module.css';

interface PageHeaderProps {
  title: string;
  extra?: React.ReactNode[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, extra }) => {
  return (
    <div className={styles.pageHeader}>
      <h2 className={styles.title}>{title}</h2>
      {extra && <Space size="middle">{extra}</Space>}
    </div>
  );
};

export default PageHeader;
