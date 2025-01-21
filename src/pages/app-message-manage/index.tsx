import { useCallback, useEffect, useRef, useState } from 'react';
import { Table, Card, Button, Message, Modal, Select, Input, Space, Form, Popconfirm, Typography, Grid, Avatar, Spin } from '@arco-design/web-react';
import { IconPlus, IconDelete, IconEdit, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import { appMarketRequest, appMessageRequest } from '../../http/api';
import './index.scss';
import { formatDate } from '../../utils';
import { debounce } from 'lodash';
import { frontBaseURL } from '../../http/instance';
const { Option } = Select;
const FormItem = Form.Item;

interface UserData {
  id: string;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  user_role: 'admin' | 'user';
  created_at: string;
}

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
}

function AppMessageManage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [appMessages, setAppMessages] = useState<UserData[]>([]);
  const [selectedAppMessages, setSelectedAppMessages] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingSysMessage, seteditingSysMessage] = useState<UserData | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<'admin' | 'user' | 'all'>('all');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [tform] = Form.useForm();

  const [appInfoOptions, setAppInfoOptions] = useState([]);
  const [appInfoOptionValue, setAppInfoOptionValue] = useState("");




  const [fetching, setFetching] = useState(false);

  const debouncedFetchAppInfo = useCallback(
    debounce(async (inputValue) => {
      setFetching(true);
      setAppInfoOptions([]);

      const apps = await appMarketRequest.getAppInfolist({
        page: 1,
        pageSize: 5,
        name: inputValue,
      })

      const options = apps.map((app: any) => ({
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div><Avatar size={24} style={{ marginLeft: 6, marginRight: 12 }}>
              <img alt='avatar' src={`${frontBaseURL}/${app.app_icon}`} />
            </Avatar></div>
            {`${app.app_name} ${app.app_package_name}`}
          </div>
        ),
        value: app.id,
      }));
      setAppInfoOptions(options);
      setFetching(false);
    }, 500),
    []
  );

  // 获取应用列表
  const fetchAppMessage = async (params = {}) => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const res = await appMessageRequest.getAllMessages({
        page: current || 1,
        pageSize,
        keyword: tform.getFieldsValue(),
        role: roleFilter === 'all' ? undefined : roleFilter,
        ...params
      });
      setAppMessages(res.data.messages || []);
      setPagination({
        ...res.data.pagination,
      });
    } catch (error) {
      console.log(error);
      //Message.error('获取应用列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppMessage();
  }, [searchKeyword, roleFilter]);

  // 处理分页变化
  const handlePageChange = (current: number, pageSize: number) => {
    setPagination({ ...pagination, current, pageSize });
    fetchAppMessage({ page: current, pageSize });
  };

  // 删除应用
  const handleDelete = async (id: string) => {
    try {
      console.log(id);
      await appMessageRequest.deleteMessage(id);
      Message.success('删除成功');
      fetchAppMessage();
    } catch (error) {
      console.log(error)
      //Message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      console.log('editingSysMessage', editingSysMessage)
      if (editingSysMessage) {
        await appMessageRequest.updateMessage({ ...values, id: editingSysMessage.messgae_id });
        Message.success('更新成功');
      } else {
        console.log(values);
        await appMessageRequest.sendAppMessage({
          app_id: values.appInfo,
          message_text: values.message_text,
        });
        Message.success('创建成功');
      }
      setVisible(false);
      form.resetFields();
      fetchAppMessage();
    } catch (error) {
      Message.error(editingSysMessage ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '序号',
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      title: 'id',
      dataIndex: 'messgae_id',
    },
    {
      title: '消息发布者',
      dataIndex: 'user_id',
    },
    {
      title: '发布者名称',
      dataIndex: 'username',
    },
    {
      title: '发布者昵称',
      dataIndex: 'nickname',
    },
    {
      title: '包名',
      dataIndex: 'app_package_name',
    },
    {
      title: 'App名称',
      dataIndex: 'app_name',
    },
    {
      title: '消息',
      dataIndex: 'message_text',
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      render: (text) => {
        return formatDate(text);
      }
    },
    {
      title: '操作',
      render: (_, record: UserData) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => {
              seteditingSysMessage(record);
              form.setFieldsValue(record);
              setVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该消息吗？"
            onOk={() => handleDelete(record.messgae_id)}
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
    <div className="app-message-manage">
      <Card
        title="应用消息管理"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={() => {
                seteditingSysMessage(null);
                form.resetFields();
                setVisible(true);
              }}
            >
              新增消息
            </Button>
            <Button type="primary" onClick={() => fetchAppMessage()}>
              刷新列表
            </Button>
          </Space>
        }
      >
        <div className="search-bar">
          <Form.Provider
            onFormValuesChange={(name, changedValues, info) => {
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
                  <Form.Item label='发布者昵称' field='nick_name'>
                    <Input placeholder='发布者昵称' />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='包名' field='app_package_name'>
                    <Input placeholder='包名' />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='App名称' field='app_name'>
                    <Input placeholder='应用名' />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label='消息' field='message_text'>
                    <Input placeholder='消息' />
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

        <Table
          className="scrollable-table"
          rowKey="id"
          loading={loading}
          columns={columns}
          data={appMessages}
          rowSelection={{
            selectedRowKeys: selectedAppMessages,
            onChange: (selectedRowKeys) => setSelectedAppMessages(selectedRowKeys as string[]),
          }}
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
      </Card>

      <Modal
        title={editingSysMessage ? '编辑消息' : '新增消息'}
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
          {editingSysMessage && (
            <FormItem
              label="id"
              field="id"
              initialValue={editingSysMessage?.messgae_id}
            >  <Input disabled value={editingSysMessage?.messgae_id} />
            </FormItem>

          )}
          {!editingSysMessage && (
            <FormItem
              label="应用"
              field="appInfo"
              rules={[{ required: true, message: '请输入包名' }]}
            >
              <Select
                style={{ width: 345 }}
                showSearch
                options={appInfoOptions}
                placeholder='根据包名和App名称搜索'
                filterOption={false}
                value={appInfoOptionValue}
                renderFormat={(option) => {
                  return option?.children?.props?.children[1];
                }}
                notFoundContent={
                  fetching ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Spin style={{ margin: 12 }} />
                    </div>
                  ) : null
                }
                onSearch={debouncedFetchAppInfo}
              />
            </FormItem>
          )}

          <FormItem
            label="应用消息"
            field="message_text"
            rules={[{ required: true, message: '请输入消息' }]}
          >
            <Input placeholder="请输入消息" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default AppMessageManage;
