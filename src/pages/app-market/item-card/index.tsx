import React from "react";
import { Image, Space, Tag } from "@arco-design/web-react";
import "./index.scss";

interface AppItemCardProps {
  data: any;
}
const AppItemCard = (props: AppItemCardProps) => {
  const { data = {} } = props || {};
  return (
    <div className="app-item-card">
      <Space direction="vertical">
        <Image className="icon" src={data?.icon} />
        <div className="info">
          <div className="info-title">{data?.name}</div>
          <Tag size="small" color="green">
            {data?.version ? `v${data?.version}` : "beta"}
          </Tag>
        </div>
        <div className="info-description">{data?.description}</div>
        <Space>
          {data?.keywords?.map((item: string) => (
            <Tag size="small" color="arcoblue">
              {item}
            </Tag>
          ))}
        </Space>
      </Space>
    </div>
  );
};

export default AppItemCard;
