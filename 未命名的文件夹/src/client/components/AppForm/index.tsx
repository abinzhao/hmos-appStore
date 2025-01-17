import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { AppData } from '../../services/api';
import UploadButton from '../UploadButton';
import styles from './index.module.css';

interface AppFormProps {
  initialValues?: AppData;
  onSubmit: (values: AppData) => void;
  onCancel: () => void;
}

const AppForm: React.FC<AppFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const handleUploadSuccess = (field: string) => (url: string) => {
    form.setFieldValue(field, url);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="name"
        label="应用名称"
        rules={[{ required: true, message: '请输入应用名称' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="应用描述"
        rules={[{ required: true, message: '请输入应用描述' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="category"
        label="应用分类"
        rules={[{ required: true, message: '请选择应用分类' }]}
      >
        <Select>
          <Select.Option value="games">游戏</Select.Option>
          <Select.Option value="tools">工具</Select.Option>
          <Select.Option value="education">教育</Select.Option>
          <Select.Option value="social">社交</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="version"
        label="版本号"
        rules={[{ required: true, message: '请输入版本号' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="iconUrl"
        label="应用图标"
        rules={[{ required: true, message: '请上传应用图标' }]}
      >
        <div>
          <UploadButton
            type="icon"
            onSuccess={handleUploadSuccess('iconUrl')}
            accept="image/*"
          />
          {form.getFieldValue('iconUrl') && (
            <div className={styles.preview}>
              <img src={form.getFieldValue('iconUrl')} alt="icon" />
            </div>
          )}
        </div>
      </Form.Item>

      <Form.Item
        name="packageUrl"
        label="应用安装包"
        rules={[{ required: true, message: '请上传应用安装包' }]}
      >
        <div>
          <UploadButton
            type="package"
            onSuccess={handleUploadSuccess('packageUrl')}
            accept=".apk"
          />
          {form.getFieldValue('packageUrl') && (
            <div className={styles.fileName}>
              已上传：{form.getFieldValue('packageUrl').split('/').pop()}
            </div>
          )}
        </div>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialValues ? '更新' : '创建'}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AppForm;
