import React, { useState, useEffect } from 'react';
import { Modal, List, Button, Result, Steps, message } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, AndroidOutlined } from '@ant-design/icons';
import { appAPI } from '../../../services/api';
import styles from './InstallModal.module.css';

interface InstallModalProps {
  appId: number;
  visible: boolean;
  onClose: () => void;
}

interface Device {
  id: string;
  status: string;
  name?: string;
}

const { Step } = Steps;

const InstallModal: React.FC<InstallModalProps> = ({
  appId,
  visible,
  onClose,
}) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>();
  const [currentStep, setCurrentStep] = useState(0);
  const [installing, setInstalling] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await appAPI.getConnectedDevices();
      setDevices(data);
    } catch (error) {
      message.error('获取设备列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchDevices();
    }
  }, [visible]);

  const handleInstall = async () => {
    if (!selectedDevice) {
      message.error('请选择要安装的设备');
      return;
    }

    setInstalling(true);
    try {
      await appAPI.installApp(appId, selectedDevice);
      setSuccess(true);
      setCurrentStep(2);
      message.success('安装成功');
    } catch (error) {
      message.error('安装失败');
    } finally {
      setInstalling(false);
    }
  };

  const handleClose = () => {
    setSelectedDevice(undefined);
    setCurrentStep(0);
    setSuccess(false);
    onClose();
  };

  const steps = [
    {
      title: '选择设备',
      content: (
        <List
          className={styles.deviceList}
          loading={loading}
          dataSource={devices}
          renderItem={(device) => (
            <List.Item 
              className={styles.deviceItem}
              onClick={() => {
                setSelectedDevice(device.id);
                setCurrentStep(1);
              }}
            >
              <List.Item.Meta
                avatar={<AndroidOutlined className={styles.deviceIcon} />}
                title={device.name || device.id}
                description={`状态: ${device.status}`}
              />
              {selectedDevice === device.id && (
                <CheckCircleOutlined className={styles.selectedIcon} />
              )}
            </List.Item>
          )}
          locale={{
            emptyText: '未检测到已连接的设备'
          }}
        />
      ),
    },
    {
      title: '确认安装',
      content: (
        <div className={styles.confirmStep}>
          <p>即将在以下设备上安装应用：</p>
          <p className={styles.deviceInfo}>
            {devices.find(d => d.id === selectedDevice)?.name || selectedDevice}
          </p>
          <div className={styles.confirmButtons}>
            <Button onClick={() => setCurrentStep(0)}>返回</Button>
            <Button 
              type="primary" 
              onClick={handleInstall}
              loading={installing}
            >
              开始安装
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: '安装完成',
      content: (
        <Result
          status={success ? "success" : "error"}
          title={success ? "安装成功" : "安装失败"}
          subTitle={
            success 
              ? "应用已成功安装到设备上" 
              : "安装过程中出现错误，请重试"
          }
          extra={[
            <Button key="back" onClick={handleClose}>
              完成
            </Button>,
          ]}
        />
      ),
    },
  ];

  return (
    <Modal
      title="安装到设备"
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <Steps current={currentStep} className={styles.steps}>
        {steps.map(item => (
          <Step 
            key={item.title} 
            title={item.title}
            icon={installing && currentStep === 1 ? <LoadingOutlined /> : null}
          />
        ))}
      </Steps>
      <div className={styles.stepsContent}>
        {steps[currentStep].content}
      </div>
    </Modal>
  );
};

export default InstallModal;
