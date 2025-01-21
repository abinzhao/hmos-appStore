import { useEffect, useState } from 'react';
import { Table, Card, Button, Message, Modal, Select, Input, Space, Form, Popconfirm } from '@arco-design/web-react';
import { IconPlus, IconDelete, IconEdit, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import { userRequest } from '../../http/api';
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

function UserManage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingSysMessage, seteditingSysMessage] = useState<UserData | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchKvs, setSearchKvs] = useState('');
  const [roleFilter, setRoleFilter] = useState<'admin' | 'user' | 'all'>('all');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取用户列表
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const res = await userRequest.getAllUsers({
        page: current,
        pageSize,
        search: searchKeyword,
        role: roleFilter === 'all' ? undefined : roleFilter,
        ...params
      });
      setUsers(res.data.users || []);
      setPagination({
        ...res.data.pagination,
      });
    } catch (error) {
      console.log(error);
      //Message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 处理分页变化
  const handlePageChange = (current: number, pageSize: number) => {
    setPagination({ ...pagination, current, pageSize });
    fetchUsers({ page: current, pageSize });
  };

  // 批量重置密码
  const handleBatchReset = async () => {
    if (selectedUsers.length === 0) {
      Message.warning('请选择要重置密码的用户');
      return;
    }
    
    try {
      await Promise.all(selectedUsers.map(id => userRequest.resetUserPassword(id)));
      Message.success('密码重置成功');
      setSelectedUsers([]);
    } catch (error) {
      console.log(error);
      //Message.error('密码重置失败');
    }
  };

  // 删除用户
  const handleDelete = async (id: string) => {
    try {
      await userRequest.deleteUser(id);
      Message.success('删除成功');
      fetchUsers();
    } catch (error) {
      console.log(error)
      //Message.error('删除失败');
    }
  };

// 添加 handleSearch 方法
const handleSearch = (value, keywords: string[]) => {
  let obj = {};
  for (let item of keywords) {
    obj[item] = value;
  }
  setSearchKvs(obj);
  setSearchKeyword(value);
  //setPagination({ ...pagination, current: 1 }); // 重置分页
};

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (editingSysMessage) {
        await userRequest.updateUser({
          id: editingSysMessage.id,
          ...values
        });
        Message.success('更新成功');
      } else {
        await userRequest.createUser(values);
        Message.success('创建成功');
      }
      setVisible(false);
      form.resetFields();
      fetchUsers();
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
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (text) => (
        <img src={text} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
      ),
    },
    {
      title: '角色',
      dataIndex: 'user_role',
      render: (role: string) => (
        role === 'admin' ? '管理员' : '普通用户'
      ),
    },
    {
      title: '注册时间',
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
            title="确定要删除该用户吗？"
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
    <div className="user-manage">
      <Card
        title="用户管理"
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
              新增用户
            </Button>
            <Button
              type="primary"
              status="warning"
              icon={<IconRefresh />}
              disabled={selectedUsers.length === 0}
              onClick={handleBatchReset}
            >
              批量重置密码
            </Button>
            <Button type="primary" onClick={() => fetchUsers()}>
              刷新列表
            </Button>
          </Space>
        }
      >
        <div className="search-bar">
          <Space>
            <Input.Search
              placeholder="搜索名称/昵称/邮箱"
              style={{ width: 300 }}
              value={searchKeyword}
              onChange={value => handleSearch(value, ['nickname', 'email'])}
              prefix={<IconSearch />}
            />
            <Select
              placeholder="角色筛选"
              style={{ width: 120 }}
              value={roleFilter}
              onChange={value => {
                setRoleFilter(value);
                setPagination({ ...pagination, current: 1 });
              }}
            >
              <Option value="all">全部角色</Option>
              <Option value="admin">管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Space>
        </div>
        <Table
        className="scrollable-table"
          rowKey="id"
          loading={loading}
          columns={columns}
          data={users}
          rowSelection={{
            selectedRowKeys: selectedUsers,
            onChange: (selectedRowKeys) => setSelectedUsers(selectedRowKeys as string[]),
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
        title={editingSysMessage ? '编辑用户' : '新增用户'}
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
            label="用户名"
            field="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </FormItem>
          <FormItem
            label="昵称"
            field="nickname"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </FormItem>
          <FormItem
            label="头像url"
            field="avatar"
            rules={[{ required: true, message: '请输入头像url' }]}
          >
            <Input placeholder="请输入头像url" />
          </FormItem>
          <FormItem
            label="邮箱"
            field="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </FormItem>
          {!editingSysMessage && (
            <FormItem
              label="密码"
              field="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </FormItem>
          )}
          <FormItem
            label="角色"
            field="user_role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="user">普通用户</Option>
              <Option value="admin">管理员</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManage;
