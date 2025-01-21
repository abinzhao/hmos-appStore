import { useTranslation } from "react-i18next";
import { Form, Input, Button, Card, Radio, Upload, Message, Grid, Avatar, Divider, Pagination, Spin } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { appMarketRequest, appMessageRequest } from "../../http/api";
import { frontBaseURL } from "../../http/instance";
import { getUrlParams } from "../../utils";
import { appCategory, publishType } from "../edit-app/contants";
import "./index.scss";

const { Row, Col } = Grid;
const FormItem = Form.Item;

function AppDetailPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const params = getUrlParams(window.location.href);
  const [app_messagess, setapp_messagess] = useState<any[]>([]);
  const [app_messagesContent, setapp_messagesContent] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [appDetail, setAppDetail] = useState<any>(null);

  const getDetail = async () => {
    if (!params?.id) return;
    try {
      const res = await appMarketRequest.getAppDetail({ id: params?.id });
      
      // 如果 app_category 是 JSON 字符串，需要解析它
      const categoryValue = res.data.app_category;
      
      // 设置基本表单数据，包括 app_category
      form.setFieldsValue({
        ...res.data,
        app_category: categoryValue // 直接设置解析后的值
      });

      // 保存应用详情数据
      setAppDetail(res.data);

    } catch (error: any) {
      Message.error(error?.message || t("APIerror"));
    }
  };

  // 获取应用留言列表
  const getapp_messagess = async (page = 1) => {
    try {
      setMessageLoading(true);
      /*const res = await httpFront.post(`/api/app-messages/${params?.id}`, {
        page,
        pageSize: pagination.pageSize
      });*/
      
      const res = await appMessageRequest.getAppMessages(params?.id, {
        page,
        pageSize: pagination.pageSize
      });
      
      setapp_messagess(res.data.messages || []);
      setPagination({
        ...pagination,
        current: page,
        total: res.data.pagination.total
      });
    } catch (error: any) {
      Message.error(error?.message || t("APIerror"));
    } finally {
      setMessageLoading(false);
    }
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    getapp_messagess(page);
  };

  // 提交评论
  const handleapp_messagesSubmit = async () => {
    if (!app_messagesContent.trim()) {
      Message.warning(t("pleaseInputapp_messages"));
      return;
    }

    try {
      setLoading(true);
      await appMessageRequest.sendAppMessage( {
        app_id: params?.id,
        message_text: app_messagesContent
      })
      Message.success(t("消息提交成功"));
      setapp_messagesContent('');
      getapp_messagess(1); // 重新加载第一页
    } catch (error: any) {
      Message.error(error?.message || t("APIerror"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (app_file_url: any) => {
    const splitRes = app_file_url.split('/');
    console.log(splitRes)
    appMarketRequest.downloadFile(splitRes[1], splitRes[2], splitRes[3], params?.id)
  }

  useEffect(() => {
    getDetail();
    getapp_messagess(1); // 初始加载第一页
  }, []);

  // 只在有数据时渲染表单项
  const renderUploadItems = () => {
    if (!appDetail) return null;

    return (
      <>
        <FormItem label="App图标" field="app_icon">
          <Upload
            disabled
            listType="picture-card"
            fileList={[{
              uid: '-1',
              name: 'icon',
              url: `${frontBaseURL}/${appDetail.app_icon}`
            }]}
          />
        </FormItem>
        <FormItem label="App截图" field="app_screenshot">
          <Upload
            disabled
            listType="picture-card"
            fileList={[{
              uid: '-1',
              name: 'screenshot',
              url: `${frontBaseURL}/${appDetail.app_screenshot}`
            }]}
          />
        </FormItem>
        <FormItem label="应用包" field="app_file_url">
          <div className="file-info">
            <button onClick={() => {handleDownload(appDetail.app_file_url)}} className="file-name">{appDetail.app_file_url?.split('/').pop()}</button>
          </div>
        </FormItem>
      </>
    );
  };

  return (
    <div className="app-detail-page">
      <Row gutter={24}>
        <Col span={14}>
          <Card
            className="edit-app-page"
            hoverable
            style={{
              width: "100%",
              height: "95vh",
              overflow: "auto",
              borderRadius: "12px",
            }}>
            <Form
              form={form}
              style={{ width: 600 }}
              disabled={true}
              autoComplete="off">
              <FormItem label="包名" field="app_package_name">
                <Input placeholder="请输入包名称" />
              </FormItem>
              <FormItem label="App名称" field="app_name">
                <Input placeholder="请输入App名称" />
              </FormItem>
              <FormItem label="App介绍" field="app_description">
                <Input placeholder="请输入App详情信息" />
              </FormItem>
              <FormItem label="App分类" field="app_category">
                <Radio.Group>
                  {appCategory.map((item) => (
                    <Radio key={item?.value} value={item?.value}>
                      {item?.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </FormItem>
              <FormItem label="发布类型" field="publish_type">
                <Radio.Group>
                  {publishType.map((item) => (
                    <Radio key={item?.value} value={item?.value}>
                      {item?.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </FormItem>
              <FormItem label="App版本号" field="app_version">
                <Input placeholder="请输入App版本号" />
              </FormItem>
              {renderUploadItems()}
            </Form>
          </Card>
        </Col>

        {/* 右侧消息区 */}
        <Col span={10}>
          <Card className="messages-card">
            {/* 系统消息列表 */}
            <div className="messages-list">
              {messageLoading ? (
                <div className="loading-container">
                  <Spin dot />
                </div>
              ) : app_messagess.length > 0 ? (
                <>
                  {app_messagess.map((message) => (
                    <div key={message.id} className="message-item">
                      <div className="message-header">
                        <Avatar size={24}>
                          <img alt="avatar" src={message.avatar} />
                        </Avatar>
                        <span className="message-author">{message.nickname}</span>
                        <span className="message-time">{message.created_at}</span>
                      </div>
                      <div className="message-content">
                        {message.message_text}
                      </div>
                    </div>
                  ))}
                  
                  {/* 分页器 */}
                  <div className="pagination-container">
                    <Pagination
                      total={pagination.total}
                      current={pagination.current}
                      pageSize={pagination.pageSize}
                      onChange={handlePageChange}
                      size="small"
                    />
                  </div>
                </>
              ) : (
                <div className="no-messages">{t("noMessages")}</div>
              )}
            </div>

            {/* 底部固定的输入区域 */}
            <div className="message-input-container">
              <Divider />
              <div className="message-input">
                <Input.TextArea
                  placeholder={t("writeMessage")}
                  value={app_messagesContent}
                  onChange={setapp_messagesContent}
                  style={{ marginBottom: 16 }}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleapp_messagesSubmit}
                >
                  {t("submit")}
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AppDetailPage; 