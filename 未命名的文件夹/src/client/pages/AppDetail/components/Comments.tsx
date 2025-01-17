import React, { useState } from 'react';
import { 
  List, 
  Comment, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Popconfirm, 
  message 
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CommentData } from '../../../services/api';
import { formatDate } from '../../../utils/format';
import styles from './Comments.module.css';

interface CommentsProps {
  comments: CommentData[];
  loading?: boolean;
  currentUserId?: number;
  onSubmit: (content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

const { TextArea } = Input;

const Comments: React.FC<CommentsProps> = ({
  comments,
  loading,
  currentUserId,
  onSubmit,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await onSubmit(values.content);
      form.resetFields();
      message.success('评论发表成功');
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await onDelete(commentId);
      message.success('评论删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (
    <div className={styles.comments}>
      <Form form={form} className={styles.form}>
        <Form.Item
          name="content"
          rules={[
            { required: true, message: '请输入评论内容' },
            { max: 500, message: '评论不能超过500个字符' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="请输入您的评论"
            showCount
            maxLength={500}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={submitting}
          >
            发表评论
          </Button>
        </Form.Item>
      </Form>

      <List
        className={styles.commentList}
        loading={loading}
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={item => (
          <Comment
            author={item.user?.username}
            avatar={<Avatar icon={<UserOutlined />} />}
            content={<p>{item.content}</p>}
            datetime={formatDate(item.createdAt!)}
            actions={
              currentUserId === item.userId
                ? [
                    <Popconfirm
                      key="delete"
                      title="确定要删除这条评论吗？"
                      onConfirm={() => handleDelete(item.id!)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link" danger>删除</Button>
                    </Popconfirm>
                  ]
                : undefined
            }
          />
        )}
      />
    </div>
  );
};

export default Comments;
