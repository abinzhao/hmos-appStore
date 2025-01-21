import { Button, Image, Message, Popconfirm, Space, Tag, Divider } from "@arco-design/web-react";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { frontBaseURL } from "../../../http/instance";
import { useUserStore } from "../../../store";

interface AppItemCardProps {
  data: any;
}
const AppItemCard = (props: AppItemCardProps) => {
  const { data = {} } = props || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  return (
    <div className="app-item-card" onClick={() => navigate(`/appDetail?id=${data?.id}&type=detail`)}>
      <Space direction="vertical">
        <Image className="icon" src={`${frontBaseURL}/${data?.app_icon}`} preview={false} />
        <div className="info">
          <div className="info-title">{data?.app_name}</div>
          <Tag size="small" color="green">
            {data?.app_version ? `v${data?.app_version}` : "beta"}
          </Tag>

        </div>
        <Tag size="small" color="green">
          {data?.app_category ? `${data?.app_category}` : "beta"}
        </Tag>
        <div className="info-description">{data?.description}</div>
        <Space>
          {data?.keywords?.map((item: string) => (
            <Tag size="small" color="arcoblue">
              {item}
            </Tag>
          ))}
        </Space>
        <Space className="info-action">
          {(user.id === data?.user_id || user.role === "admin") && <Button
            size="small"
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/editApp?id=${data?.id}&type=edit`);
            }}>
            {t("appEdit")}
          </Button>}

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
            {(user.id === data?.user_id || user.role === "admin") &&
              <Button size="small" type="text" status="warning">
                {t("appRemoved")}
              </Button>}
          </Popconfirm>
        </Space>
      </Space>
    </div>
  );
};

export default AppItemCard;