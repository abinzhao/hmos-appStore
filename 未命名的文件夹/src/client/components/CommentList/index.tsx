import React from 'react';
import { List, Comment, Avatar, Button, Popconfirm } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { formatDate } from '../../utils/format';
import { CommentData } from '../../services/api';
import styles from './index.module.css';

interface CommentListProps {
  comments: CommentData[];
  loading?: boolean;
  currentUserId?: number;
  onDelete?: (commentId: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  loading = false,
  currentUserId,
  onDelete,
}) => {
  return (
    <List
      className={styles.commentList}
      loading={loading}
      itemLayout="horizontal"
      dataSource={comments}
      renderItem={(item) => (
        <List.Item className={styles.commentItem}>
          <Comment
            author={item.user?.username}
            avatar={
              <Avatar
                className={styles.avatar}
                icon={<UserOutlined />}
              />
            }
            content={
              <div className={styles.commentContent}>
                {item.content}
              </div>
            }
            datetime={
              <span className={styles.commentMeta}>
                {formatDate(item.createdAt!)}
              </span>
            }
            actions={
              currentUserId === item.userId && onDelete
                ? [
                    <Popconfirm
                      key="delete"
                      title="确定要删除这条评论吗？"
                      onConfirm={() => onDelete(item.id!)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link" danger>
                        删除
                      </Button>
                    </Popconfirm>
                  ]
                : undefined
            }
          />
        </List.Item>
      )}
      locale={{
        emptyText: '暂无评论'
      }}
    />
  );
};

export default CommentList;
