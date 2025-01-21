import { useEffect, useState } from 'react';
import { Table, Card, Button, Message, Modal, Select, Input, Space, Form, Popconfirm, InputNumber, Grid, Typography } from '@arco-design/web-react';
import { IconPlus, IconDelete, IconEdit } from '@arco-design/web-react/icon';
import { appMarketRequest, systemMessageRequest } from '../../http/api';
import './index.scss';
import { formatDate } from '../../utils';
import { appCategory, publishType } from '../edit-app/contants';

const { Option } = Select;
const FormItem = Form.Item;

interface AppData {
  id: string;
  app_package_name: string;
  app_name: string;
  app_version: string;
  app_description: string;
  app_icon: string;
  app_file_url: string;
  app_category: string;
  publish_type: string;
  application_status: string;
  app_screenshot: string;
}

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
}

function AppManage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sysMessages, setSysMessages] = useState<AppData[]>([]);
  const [selectedSysMessages, setSelectedSysMessages] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<AppData | null>(null);
  const [searchKeyword] = useState('');
  const [roleFilter] = useState<'admin' | 'user' | 'all'>('all');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [tform] = Form.useForm();

  const appStatusData = [
    { title: '已上架', value: "3" },
    { title: '待上架', value: "2" },
    { title: '审核中', value: "1" },
  ];

  // 获取公告列表
  const fetchApps = async (params = {}) => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const res = await appMarketRequest.getAdminApps({
        page: current || 1,
        pageSize,
        keyword: tform.getFieldsValue(),
        role: roleFilter === 'all' ? undefined : roleFilter,
        ...params
      });
      setSysMessages(res.apps || []);
      setPagination({
        ...res.pagination,
      });
    } catch (error) {
      console.log(error);
      //Message.error('获取公告列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [searchKeyword, roleFilter]);

  // 处理分页变化
  const handlePageChange = (current: number, pageSize: number) => {
    setPagination({ ...pagination, current, pageSize });
    fetchApps({ page: current, pageSize });
  };

  // 删除公告
  const handleDelete = async (id: string) => {
    try {
      await appMarketRequest.removeApp(id);
      Message.success('删除成功');
      fetchApps();
    } catch (error) {
      console.log(error)
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (editingApp) {
        await appMarketRequest.updateApp({
          id: editingApp.id,
          ...values
        });
        Message.success('更新成功');
      } else {
        await appMarketRequest.setApp(values);
        Message.success('创建成功');
      }
      setVisible(false);
      form.resetFields();
      fetchApps();
    } catch (error) {
      console.log((editingApp ? '更新失败' : '创建失败') + " error: " + error);
      //Message.error(editingApp ? '更新失败' : '创建失败');
    }
  };


  const columns = [
    {
      title: '序号',
      width: 80,
      render: (_: any, __: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'id',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: '上传用户',
      dataIndex: 'nickname',
      width: 120,
    },
    {
      title: '包名',
      dataIndex: 'app_package_name',
      width: 120,
    },
    {
      title: '软件名',
      dataIndex: 'app_name',
      width: 120,
    },
    {
      title: '软件描述',
      dataIndex: 'app_description',
      width: 200,

    },
    {
      title: '应用分类',
      dataIndex: 'app_category',
      width: 200,

    },
    {
      title: '软件版本',
      dataIndex: 'app_version',
      width: 100,
    },
    {
      title: '审核状态',
      width: 100,
      dataIndex: 'application_status',
      render: (text: any) => {
        for (const appStatus of appStatusData) {
          if (text === appStatus.value) {
            return appStatus.title;
          }
        }
        return '未定义的值';
      }
    },
    {
      title: '软件图标',
      dataIndex: 'app_icon',
      width: 230,
    },
    {
      title: '软件截图',
      dataIndex: 'app_screenshot',
      width: 230,
    },
    {
      title: '软件地址',
      dataIndex: 'app_file_url',
      width: 230,
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      width: 100,
      render: (text: any) => {
        return formatDate(text);
      }
    },
    {
      title: '操作',
      fixed: 'left',
      render: (_, record: AppData) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => {
              console.log('record', record);
              setEditingApp({...record});
              form.setFieldsValue({...record});
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该应用吗？"
            onOk={() => handleDelete(record.id)}
          >
            <Button
              type="text"
              status="danger"
              size="small"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="app-manage">
      <Card
        title="应用管理"
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={() => {
                setEditingApp(undefined);
                form.resetFields();
                setVisible(true);
              }}
            >
              新增应用
            </Button>
            <Button type="primary" onClick={() => fetchApps()}>
              刷新列表
            </Button>
          </Space>
        }
      >
        <div className="search-bar">
          <Form.Provider
            onFormValuesChange={() => {
              //console.log('onFormValuesChange: ', name, changedValues, info);
            }}
            onFormSubmit={(name, values, info) => {
              //console.log('onFormSubmit: ', name, values, info);

              if (name === 'modalForm') {
                info.forms.searchForm.setFieldsValue({
                  email: values.email,
                });
                setVisible(false);
              }

              Message.info({
                icon: <span></span>,
                content: (
                  <div style={{ textAlign: 'left' }}>
                    <span>form values:</span>
                    <pre>
                      {JSON.stringify(
                        {
                          ...info.forms.searchForm.getFieldsValue(),
                          ...info.forms.refreshForm.getFieldsValue(),
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                ),
              });
            }}
          >
            <Form id='searchForm' layout='vertical' form={tform}>
              <Grid.Row gutter={24}>
                <Grid.Col span={6}>
                  <Form.Item label='包名称' field='app_package_name'>
                    <Input placeholder='包名称' />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='应用名称' field='app_name'>
                    <Input placeholder='应用名称' />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='发布者' field='user_id'>
                    <Input placeholder='发布者' />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='描述' field='app_description'>
                    <Input placeholder='描述' />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row gutter={24}>
                <Grid.Col span={6}>
                  <Form.Item label='应用类别' field='app_category'>
                    <Input placeholder='应用类别' />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='应用状态' field='application_status'>
                    <Select placeholder='Select' style={{ width: 154 }} allowClear>
                      {appStatusData.map((appStatus, index) => (
                        <Option key={index} value={appStatus.value}>
                          {appStatus.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='最小下载量' field='min_install_count'>
                    <InputNumber placeholder='最小下载量' />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='最大下载量' field='max_install_count'>
                    <InputNumber placeholder='最大下载量' />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
            </Form>
            <Grid.Row justify='space-between' align='center'>
              <Typography.Text style={{ fontSize: 18 }} bold>
                Result
              </Typography.Text>
            </Grid.Row>
          </Form.Provider>
        </div>
        <div className='table-container'>

          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            data={sysMessages}
            scroll={{ x: '1500px' }}
            rowSelection={{
              selectedRowKeys: selectedSysMessages,
              onChange: (selectedRowKeys) => setSelectedSysMessages(selectedRowKeys as string[]),
            }}
            pagePosition='br'
            pagination={{
              sizeCanChange: true,
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showTotal: true,
              pageSizeChangeResetCurrent: true,
              onChange: handlePageChange
            }}
          />
        </div>
      </Card>

      <Modal
        title={editingApp ? '编辑应用' : '新增应用'}
        visible={visible}
        onOk={() => form.submit()}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        autoFocus={false}
        focusLock={true}
      >
        <Form
          form={form}
          onSubmit={handleSubmit}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          {editingApp && (
            <FormItem
              label="id"
              field="id"
            >  <Input disabled value={editingApp?.id} />
            </FormItem>
          )}
          <FormItem
            label="包名"
            field="app_package_name"
            rules={[{ required: true, message: '请输入消息' }]}
          >
            <Input placeholder="请输入消息" />
          </FormItem>
          <FormItem
            label="App名称"
            field="app_name"
            rules={[{ required: true, message: '请输入消息' }]}
          >
            <Input placeholder="请输入消息" />
          </FormItem>
          <FormItem
            label="App介绍"
            field="app_description"
            rules={[{ required: true, message: '请输入消息' }]}
          >
            <Input placeholder="请输入消息" />
          </FormItem>  
          <FormItem
            label="App分类"
            field="app_category"
            required={true}
          >
            <Select placeholder="请选择分类">
              {appCategory.map((item, index) => (
                <Option key={index} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            label="发布类型"
            field="publish_type"
            required={true}
          >
            <Select placeholder="请选择发布类型" value={editingApp?.publish_type}>
              {publishType.map((item, index) => (
                <Option key={index} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            label="App版本号"
            field="app_version"
          >
            <Input placeholder="请输入消息" />
          </FormItem>
          <FormItem
            label="App图标"
            field="app_icon"
          >
            <Input placeholder="请输入消息" />
          </FormItem>
          <FormItem
            label="App截图"
            field="app_screenshot"
          >
            <Input placeholder="请输入消息" />
          </FormItem>
          <FormItem
            label="应用包"
            field="app_file_url"
          >
            <Input placeholder="请输入消息" />
          </FormItem>
         
          <FormItem
            label="审核状态"
            field="application_status"
            rules={[{ required: true, message: '请输入消息' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="3">已上架</Option>
              <Option value="2">待上架</Option>
              <Option value="1">待审核</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default AppManage;
