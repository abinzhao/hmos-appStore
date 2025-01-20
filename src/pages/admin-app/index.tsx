import { useTranslation } from "react-i18next";
import { Card, Table, TableColumnProps } from "@arco-design/web-react";
import "./index.scss";
import { useEffect, useState } from "react";
import { appMarketRequest } from "../../http/api";

// 表格列的定义
const columns: TableColumnProps[] = [
  {
    title: "应用名称",
    dataIndex: "appName",
  },
  {
    title: "应用包名",
    dataIndex: "appPackageName",
  },
  {
    title: "应用状态",
    dataIndex: "appStatus",
    render: (text, record) => {
      // 根据不同的应用状态显示不同的颜色和图标
      let statusColor = "green";
      if (record.appStatus === "pending") {
        statusColor = "yellow";
      } else if (record.appStatus === "rejected") {
        statusColor = "red";
      }
      return <span style={{ color: statusColor }}>{record.appStatus}</span>;
    },
  },
  {
    title: "应用分类",
    dataIndex: "appCategory",
  },
];

// 表格数据
const data = [
  {
    key: "1",
    appName: "Jane Doe",
    appPackageName: "com.example.jane",
    appStatus: "approved",
    appCategory: "32 Park Road, London",
  },
  {
    key: "2",
    appName: "Alisa Ross",
    appPackageName: "com.example.alisa",
    appStatus: "pending",
    appCategory: "35 Park Road, London",
  },
  {
    key: "1",
    appName: "Kevin Sandra",
    appPackageName: "com.example.kevin",
    appStatus: "rejected",
    appCategory: "31 Park Road, London",
  },
  {
    key: "4",
    appName: "Ed Hellen",
    appPackageName: "com.example.ed",
    appStatus: "approved",
    appCategory: "42 Park Road, London",
  },
  {
    key: "5",
    appName: "William Smith",
    appPackageName: "com.example.william",
    appStatus: "pending",
    appCategory: "62 Park Road, London",
  },
];

function AdminAppPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<string>("systemMessage");
  const [message, setMessage] = useState<any>({});

  const getMessageList = async (type: string) => {
    setTab(type);
    // 获取消息列表数据，可添加分页逻辑
    const res = await appMarketRequest?.getMessageList(type);
    if (res?.length) {
      setMessage({ ...message, [type]: res || [] });
    }
  };

  useEffect(() => {
    getMessageList(tab);
  }, []);

  return (
    <div className="home-page">
      <Card
        hoverable
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        }}>
        <Table
          columns={columns}
          data={data}
          rowClassName={(record, index) => (index % 2 === 0 ? "even-row" : "odd-row")}
          // striped
        />
      </Card>
    </div>
  );
}

export default AdminAppPage;
