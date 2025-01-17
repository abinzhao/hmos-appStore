import React, { useState } from 'react';
import { Form, Input, Button, Space } from 'antd';
import {
  SmileOutlined,
  PictureOutlined,
  SendOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';

const { TextArea } = Input;

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  loading?: boolean;
  maxLength?: number;
  placeholder?: string;
  showToolbar?: boolean;
  initialValue?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  loading = false,
  maxLength = 500,
  placeholder = '请输入评论内容...',
  showToolbar = true,
  initialValue = '',
}) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState(initialValue);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values.content);
      form.resetFields();
      setContent('');
    } catch (error) {
      // 表单验证错误会被 Form 组件自动处理
      console.error('Comment submission error:', error);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <Form form={form} className={styles.form}>
      <Form.Item
        name="content"
        rules={[
          { required: true, message: '请输入评论内容' },
          { max: maxLength, message: `评论内容不能超过 ${maxLength} 个字符` }
        ]}
      >
        <TextArea
          className={styles.textArea}
          placeholder={placeholder}
          autoSize={{ minRows: 3, maxRows: 6 }}
          maxLength={maxLength}
          showCount
          value={content}
          onChange={handleContentChange}
        />
      </Form.Item>

      {showToolbar && (
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <Button
              type="text"
              icon={<SmileOutlined />}
              title="插入表情"
            />
            <Button
              type="text"
              icon={<PictureOutlined />}
              title="插入图片"
            />
          </div>

          <div className={styles.toolbarRight}>
            <span className={styles.wordCount}>
              {content.length} / {maxLength}
            </span>
            <Space>
              <Button
                onClick={() => form.resetFields()}
                disabled={loading || !content}
              >
                清空
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleSubmit}
                disabled={!content}
              >
                发表评论
              </Button>
            </Space>
          </div>
        </div>
      )}

      {!showToolbar && (
        <Form.Item className={styles.submit}>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            发表评论
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default CommentForm;
