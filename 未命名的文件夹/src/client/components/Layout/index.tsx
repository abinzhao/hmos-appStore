import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Menu, Dropdown, Button, message } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppstoreOutlined,
  UserOutlined,
  DashboardOutlined,
  NotificationOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { userAPI } from '../../services/api';
import styles from './index.module.css';

const { Header, Sider, Content } = AntLayout;

interface User {
  id: number;
  username: string;
  role: string;
}

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchCurrentUser();
  }, [navigate]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await userAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('退出成功');
    navigate('/login');
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: '首页',
      },
      {
        key: '/apps',
        icon: <AppstoreOutlined />,
        label: '应用管理',
      },
    ];

    if (user?.role === 'admin') {
      items.push(
        {
          key: '/users',
          icon: <UserOutlined />,
          label: '用户管理',
        },
        {
          key: '/announcements',
          icon: <NotificationOutlined />,
          label: '系统公告',
        }
      );
    }

    return items;
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人信息',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '设置',
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        danger: true,
      },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        handleLogout();
      } else if (key === 'profile') {
        navigate('/profile');
      } else if (key === 'settings') {
        navigate('/settings');
      }
    },
  };

  if (!user) {
    return null;
  }

  return (
    <AntLayout className={styles.layout}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div className={styles.logo}>
          {!collapsed && '应用商店管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header className={styles.header}>
          <div className={styles.headerRight}>
            <Dropdown menu={userMenu} placement="bottomRight">
              <Button type="link" className={styles.userButton}>
                <UserOutlined />
                <span>{user.username}</span>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
