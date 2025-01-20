import React from 'react';
import { Button, TableColumnProps } from '@arco-design/web-react';

export const columns: TableColumnProps[] = [
  {
    title: '应用信息',
    width: 300,
    dataIndex: 'appPackage',
    render: (_, record) => (
      <div>
        {[
          { label: '应用ID', value: record.id },
          { label: '应用包名', value: record.appPackage },
          { label: '应用名称', value: record.appName },
          { label: '应用体积', value: record.appSize },
        ].map((item) => (
          <div key={item.label}>
            <span style={{ color: '#999', fontSize: 12 }}>{item.label}:</span>
            <span style={{ marginLeft: 8, fontSize: 14 }}>{item.value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: '应用详情',
    width: 300,
    dataIndex: 'appDescription',
  },
  {
    title: '应用版本',
    width: 100,
    dataIndex: 'appVersion',
  },
  {
    title: '应用分类',
    width: 100,
    dataIndex: 'appCategory',
  },
  {
    title: '应用状态',
    width: 100,
    dataIndex: 'appStatus',
  },
  {
    title: '应用评分',
    width: 100,
    dataIndex: 'appRating',
  },
  {
    title: '上线时间',
    width: 100,
    dataIndex: 'onlineTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 150,
    render: (_, record) => {
      return (
        <div style={{ display: 'flex' }}>
          <Button type="text">查看</Button>
          <Button type="text">编辑</Button>
        </div>
      );
    },
  },
];
export const data = [
  {
    id: 1,
    appPackage: 'com.example.app1',
    appName: '示例应用 1',
    appVersion: '1.0.0',
    appCategory: '工具',
    appStatus: '已上线',
    onlineTime: '2025-01-01T08:00:00',
    appDescription:
      '这是一款功能强大的工具应用，能帮助你完成各种日常任务，操作简单方便，提高工作效率。',
    appSize: '100 MB',
    appRating: 4.5,
  },
  {
    id: 2,
    appPackage: 'com.example.app2',
    appName: '示例游戏 2',
    appVersion: '2.1.0',
    appCategory: '游戏',
    appStatus: '审核中',
    onlineTime: null,
    appDescription:
      '一款精彩刺激的冒险游戏，带你进入奇幻的冒险世界，探索未知的领域，挑战各种强大的怪物。',
    appSize: '250 MB',
    appRating: 3.8,
  },
  {
    id: 3,
    appPackage: 'com.example.app3',
    appName: '学习助手',
    appVersion: '1.2.3',
    appCategory: '教育',
    appStatus: '已上线',
    onlineTime: '2025-01-10T12:30:00',
    appDescription:
      '专为学生打造的学习助手，提供丰富的学习资源，帮助你更好地掌握知识，提升学习成绩。',
    appSize: '150 MB',
    appRating: 4.2,
  },
  {
    id: 4,
    appPackage: 'com.example.app4',
    appName: '创意工具',
    appVersion: '3.0.0',
    appCategory: '工具',
    appStatus: '未上线',
    onlineTime: null,
    appDescription:
      '一款激发创意的工具，提供各种实用的创意工具和模板，让你的创意得以实现。',
    appSize: '300 MB',
    appRating: 4.0,
  },
];
