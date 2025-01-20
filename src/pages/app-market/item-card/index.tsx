import { Button, Image, Message, Popconfirm, Space, Tag, Divider } from "@arco-design/web-react";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface AppItemCardProps {
  data: any;
}
const AppItemCard = (props: AppItemCardProps) => {
  const { data = {} } = props || {};
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="app-item-card">
      <Space direction="vertical">
        <Image className="icon" src={data?.icon} preview={false} />
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
        <Space className="info-action">
          <Button
            size="small"
            type="text"
            onClick={() => navigate(`/editApp?id=${data?.id}&type=edit`)}>
            {t("appEdit")}
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            focusLock
            title={t("appRemovedPupupTitle")}
            content={t("appRemovedPupupDesc")}
            onOk={() => {
              Message.info({
                content: "ok",
              });
            }}
            onCancel={() => {
              Message.error({
                content: "cancel",
              });
            }}>
            <Button size="small" type="text" status="warning">
              {t("appRemoved")}
            </Button>
          </Popconfirm>
        </Space>
      </Space>
    </div>
  );
};

export default AppItemCard;
