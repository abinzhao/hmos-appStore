import { lazy } from 'react';
import { RouteIcons } from './icons';

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<any>;
  name: string;
  icon?: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  visible?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/home',
    element: lazy(() => import('../pages/home')),
    name: '首页',
    icon: RouteIcons.home,
  },
  {
    path: '/appMarket',
    element: lazy(() => import('../pages/app-market')),
    name: '应用市场',
    icon: RouteIcons.appMarket,
    requiredRole: 'user',
  },
  {
    path: '/userCenter',
    element: lazy(() => import('../pages/user-center')),
    name: '用户中心',
    icon: RouteIcons.userCenter,
    requiredRole: 'user'
  },
  {
    path: '/editApp',
    element: lazy(() => import('../pages/edit-app')),
    name: '编辑应用',
    icon: RouteIcons.editApp,
    requiredRole: 'user',
    visible: true
  },
  {
    path: '/myAppManage',
    element: lazy(() => import('../pages/my-app-manage')),
    name: '我的应用',
    icon: RouteIcons.userCenter,
    requiredRole: 'user'
  },
  {
    path: '/userManage',
    element: lazy(() => import('../pages/user-manage')),
    name: '用户管理',
    icon: RouteIcons.userCenter,
    requiredRole: 'admin'
  },
  {
    path: '/appMessageManage',
    element: lazy(() => import('../pages/app-message-manage')),
    name: '应用消息管理',
    icon: RouteIcons.userCenter,
    requiredRole: 'admin'
  },
  {
    path: '/sysMessageManage',
    element: lazy(() => import('../pages/sys-message-manage')),
    name: '系统公告管理',
    icon: RouteIcons.userCenter,
    requiredRole: 'admin'
  },
  {
    path: '/appManage',
    element: lazy(() => import('../pages/app-manage')),
    name: '应用管理',
    icon: RouteIcons.userCenter,
    requiredRole: 'admin'
  },
]; 