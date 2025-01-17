import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadAPI } from '../../services/api';
import styles from './index.module.css';

interface UploadButtonProps {
  type: 'icon' | 'package' | 'screenshot';
  onSuccess: (url: string) => void;
  accept?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({ type, onSuccess, accept }) => {
  const handleUpload = async (file: File) => {
    try {
      const result = await uploadAPI.uploadFile(file, type);
      onSuccess(result.path);
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败');
    }
    return false;
  };

  return (
    <Upload
      customRequest={({ file }) => handleUpload(file as File)}
      showUploadList={false}
      accept={accept}
    >
      <Button icon={<UploadOutlined />}>上传{type === 'icon' ? '图标' : type === 'package' ? '安装包' : '截图'}</Button>
    </Upload>
  );
};

export default UploadButton;
