import { useEffect, useState } from 'react';
import { Table, Card, Button, Message, Modal, Select, Input, Space, Form, Popconfirm, Tag, InputNumber, Grid, Typography } from '@arco-design/web-react';
import { IconPlus, IconDelete, IconEdit, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import { systemMessageRequest } from '../../http/api';
import './index.scss';
import { formatDate } from '../../utils';

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

function SysMessageManage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sysMessages, setSysMessages] = useState<UserData[]>([]);
  const [selectedSysMessages, setSelectedSysMessages] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingSysMessage, seteditingSysMessage] = useState<UserData | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<'admin' | 'user' | 'all'>('all');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  // 定义过滤条件的初始状态
  const [filter, setFilter] = useState({
    keyword: '',
    role: 'all',
  });

  const [tform] = Form.useForm();

  // 获取公告列表
  const fetchSysMessage = async (params = {}) => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const res = await systemMessageRequest.getSystemMessages({
        page: current || 1,
        pageSize,
        keyword: tform.getFieldsValue(),
        role: roleFilter === 'all' ? undefined : roleFilter,
        ...params
      });
      setSysMessages(res.data.sysMessage || []);
      setPagination({
        ...res.data.pagination,
      });
    } catch (error) {
      console.log(error);
      //Message.error('获取公告列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSysMessage();
  }, [searchKeyword, roleFilter]);

  // 处理分页变化
  const handlePageChange = (current: number, pageSize: number) => {
    setPagination({ ...pagination, current, pageSize });
    fetchSysMessage({ page: current, pageSize });
  };

  // 删除公告
  const handleDelete = async (id: string) => {
    try {
      await systemMessageRequest.deleteSystemMessage(id);
      Message.success('删除成功');
      fetchSysMessage();
    } catch (error) {
      console.log(error)
      //Message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (editingSysMessage) {
        await systemMessageRequest.updateSystemMessage({
          id: editingSysMessage.id,
          ...values
        });
        Message.success('更新成功');
      } else {
        await systemMessageRequest.createSystemMessage(values);
        Message.success('创建成功');
      }
      setVisible(false);
      form.resetFields();
      fetchSysMessage();
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
      dataIndex: 'id',
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
      title: '消息发布昵称',
      dataIndex: 'nickname',
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
            title="确定要删除该公告吗？"
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
    <div className="sys-message-manage">
      <Card
        title="系统公告管理"
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
              新增公告
            </Button>
            <Button type="primary" onClick={() => fetchSysMessage()}>
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
            <Grid.Col span={8}>
              <Form.Item label='名称' field='username'>
                <Input placeholder='请输入名称' />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
            <Form.Item label='昵称' field='nickname'>
                <Input placeholder='请输入昵称' />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item label='消息' field='message_text'>
                <Input placeholder='请输入消息' />
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
          data={sysMessages}
          rowSelection={{
            selectedRowKeys: selectedSysMessages,
            onChange: (selectedRowKeys) => setSelectedSysMessages(selectedRowKeys as string[]),
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
        title={editingSysMessage ? '编辑公告' : '新增公告'}
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
              initialValue={editingSysMessage?.id}
            >  <Input disabled value={editingSysMessage?.id} />
            </FormItem>
          )}
          <FormItem
            label="系统消息"
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

export default SysMessageManage;
