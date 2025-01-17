import React from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Space,
  message,
} from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { AppData } from '../../../services/api';
import styles from './AppForm.module.css';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

interface AppFormProps {
  initialValues?: AppData;
  onSubmit: (values: AppData) => void;
  onCancel: () => void;
}

const AppForm: React.FC<AppFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('文件大小不能超过100MB！');
      }
      return isLt100M;
    },
    onChange: (info: any) => {
      if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
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
        <Input placeholder="请输入应用名称" />
      </Form.Item>

      <Form.Item
        name="category"
        label="应用分类"
        rules={[{ required: true, message: '请选择应用分类' }]}
      >
        <Select placeholder="请选择应用分类">
          <Option value="game">游戏</Option>
          <Option value="tool">工具</Option>
          <Option value="social">社交</Option>
          <Option value="education">教育</Option>
          <Option value="entertainment">娱乐</Option>
          <Option value="other">其他</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="应用描述"
        rules={[{ required: true, message: '请输入应用描述' }]}
      >
        <TextArea rows={4} placeholder="请输入应用描述" />
      </Form.Item>

      <Form.Item
        name="version"
        label="版本号"
        rules={[{ required: true, message: '请输入版本号' }]}
      >
        <Input placeholder="请输入版本号，例如：1.0.0" />
      </Form.Item>

      <Form.Item
        name="icon"
        label="应用图标"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: !isEdit, message: '请上传应用图标' }]}
      >
        <Upload
          name="icon"
          listType="picture-card"
          maxCount={1}
          accept="image/*"
          {...uploadProps}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传图标</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        name="package"
        label="应用安装包"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: !isEdit, message: '请上传应用安装包' }]}
      >
        <Dragger
          name="package"
          maxCount={1}
          accept=".apk"
          {...uploadProps}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持 .apk 格式，大小不超过100MB
          </p>
        </Dragger>
      </Form.Item>

      <Form.Item
        name="screenshots"
        label="应用截图"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: !isEdit, message: '请上传至少一张应用截图' }]}
      >
        <Upload
          name="screenshots"
          listType="picture-card"
          multiple
          accept="image/*"
          {...uploadProps}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传截图</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item className={styles.formActions}>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">
            {isEdit ? '更新' : '创建'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AppForm;
