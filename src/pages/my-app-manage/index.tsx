import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Table,
  Card,
  Button,
  Message,
  Select,
  Input,
  Space,
  Form,
  Popconfirm,
  InputNumber,
  Grid,
} from "@arco-design/web-react";
import { IconDelete, IconEdit } from "@arco-design/web-react/icon";
import { appMarketRequest } from "../../http/api";
import "./index.scss";
import { formatDate } from "../../utils";

const { Option } = Select;

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
  const [loading, setLoading] = useState(false);
  const [sysMessages, setSysMessages] = useState<AppData[]>([]);
  const [selectedSysMessages, setSelectedSysMessages] = useState<string[]>([]);
  const [searchKeyword] = useState("");
  const [roleFilter] = useState<"admin" | "user" | "all">("all");
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const [tform] = Form.useForm();

  const appStatusData = [
    { title: "已上架", value: "3" },
    { title: "待上架", value: "2" },
    { title: "审核中", value: "1" },
  ];

  // 获取公告列表
  const fetchApps = async (params = {}) => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const res = await appMarketRequest.getUserApps({
        page: current || 1,
        pageSize,
        keyword: tform.getFieldsValue(),
        role: roleFilter === "all" ? undefined : roleFilter,
        ...params,
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
      Message.success("删除成功");
      fetchApps();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: 50,
    },
    {
      title: "上传用户",
      dataIndex: "nickname",
      width: 120,
    },
    {
      title: "包名",
      dataIndex: "app_package_name",
      width: 120,
    },
    {
      title: "软件名",
      dataIndex: "app_name",
      width: 120,
    },
    {
      title: "软件描述",
      dataIndex: "app_description",
      width: 200,
    },
    {
      title: "应用分类",
      dataIndex: "app_category",
      width: 200,
    },
    {
      title: "软件版本",
      dataIndex: "app_version",
      width: 100,
    },
    {
      title: "审核状态",
      width: 100,
      dataIndex: "application_status",
      render: (text: any) => {
        for (const appStatus of appStatusData) {
          if (text === appStatus.value) {
            return appStatus.title;
          }
        }
        return "未定义的值";
      },
    },
    {
      title: "软件图标",
      dataIndex: "app_icon",
      width: 230,
    },
    {
      title: "软件截图",
      dataIndex: "app_screenshot",
      width: 230,
    },
    {
      title: "软件地址",
      dataIndex: "app_file_url",
      width: 230,
    },
    {
      title: "发布时间",
      dataIndex: "created_at",
      width: 100,
      render: (text: any) => {
        return formatDate(text);
      },
    },
    {
      title: "操作",
      fixed: "left",
      render: (_: any, record: AppData) => (
        <Space>
          <Button
            type="text"
            size="small"
            disabled={record.application_status !== "1"}
            icon={<IconEdit />}
            onClick={() => {
              navigate(`/editApp?id=${record?.id}`);
            }}>
            编辑
          </Button>
          <Popconfirm title="确定要删除该应用吗？" onOk={() => handleDelete(record?.id)}>
            <Button type="text" status="danger" size="small" icon={<IconDelete />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="app-manage">
      <Card title="应用管理" style={{ marginBottom: 16 }}>
        <div className="search-bar">
          <Form.Provider
            onFormValuesChange={() => {}}
            onFormSubmit={(name, values, info) => {
              if (name === "modalForm") {
                info.forms.searchForm.setFieldsValue({
                  email: values.email,
                });
              }

              Message.info({
                icon: <span></span>,
                content: (
                  <div style={{ textAlign: "left" }}>
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
            }}>
            <Form id="searchForm" layout="vertical" form={tform} onChange={() => fetchApps()}>
              <Grid.Row gutter={24}>
                <Grid.Col span={6}>
                  <Form.Item label="包名称" field="app_package_name">
                    <Input placeholder="包名称" />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label="应用名称" field="app_name">
                    <Input placeholder="应用名称" />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label="发布者" field="user_id">
                    <Input placeholder="发布者" />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label="描述" field="app_description">
                    <Input placeholder="描述" />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row gutter={24}>
                <Grid.Col span={6}>
                  <Form.Item label="应用类别" field="app_category">
                    <Input placeholder="应用类别" />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label="应用状态" field="application_status">
                    <Select placeholder="Select" style={{ width: 154 }} allowClear>
                      {appStatusData.map((appStatus, index) => (
                        <Option key={index} value={appStatus.value}>
                          {appStatus.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label="最小下载量" field="min_install_count">
                    <InputNumber placeholder="最小下载量" />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Form.Item label="最大下载量" field="max_install_count">
                    <InputNumber placeholder="最大下载量" />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
            </Form>
          </Form.Provider>
        </div>
        <div className="table-container">
          <Table
            rowKey="id"
            loading={loading}
            columns={columns as any}
            data={sysMessages}
            scroll={{ x: "1500px" }}
            rowSelection={{
              selectedRowKeys: selectedSysMessages,
              onChange: (selectedRowKeys) => setSelectedSysMessages(selectedRowKeys as string[]),
            }}
            pagePosition="br"
            pagination={{
              sizeCanChange: true,
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showTotal: true,
              pageSizeChangeResetCurrent: true,
              onChange: handlePageChange,
            }}
          />
        </div>
      </Card>
    </div>
  );
}

export default AppManage;
