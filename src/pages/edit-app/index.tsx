import { useTranslation } from "react-i18next";
import { Form, Input, Button, Card, Radio, Upload, Message } from "@arco-design/web-react";
import "./index.scss";
import { appCategory, publishType } from "./contants";
import { useNavigate } from "react-router-dom";
import { appMarketRequest } from "../../http/api";
import { getUrlParams } from "../../utils";
import { useEffect } from "react";

const FormItem = Form.Item;

function EditAPPPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = getUrlParams(window.location.href);

  const getDetail = async () => {
    if (!params?.id) return;
    const res = await appMarketRequest.getAppDetail({ id: params?.id });
    form.setFieldsValue(res);
    console.log(res);
  };

  const onSubmit = () => {
    const values = form.getFieldsValue();
    if (!params?.id) {
      const res = appMarketRequest.setApp(values);
      console.log("🚀 ~ onSubmit ~ res:", res);
      Message.success("创建成功");
      navigate("/appMarket");
      return;
    }
    const res = appMarketRequest.updateApp(values);
    console.log("🚀 ~ onSubmit ~ res:", res);
    Message.success("创建成功");
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <Card
      className="edit-app-page"
      hoverable
      style={{
        width: "100%",
        height: "calc(100vh - 155px)",
        overflow: "auto",
        borderRadius: "12px",
      }}>
      <Form
        form={form}
        style={{ width: 600 }}
        disabled={params?.type === "detail"}
        initialValues={{
          appCategory: appCategory[appCategory?.length - 1]?.value,
          publishType: publishType[0]?.value,
          appVersion: "1.0.0",
        }}
        autoComplete="off">
        <FormItem label="包名" field="packageName" rules={[{ required: true }]}>
          <Input placeholder="请输入包名称" />
        </FormItem>
        <FormItem label="App名称" field="appName" rules={[{ required: true }]}>
          <Input placeholder="请输入App名称" />
        </FormItem>
        <FormItem label="App介绍" field="description" rules={[{ required: true }]}>
          <Input placeholder="请输入App详情信息" />
        </FormItem>
        <FormItem label="App分类" field="appCategory" rules={[{ required: true }]}>
          <Radio.Group>
            {appCategory.map((item) => {
              return <Radio value={item?.value}>{item?.label}</Radio>;
            })}
          </Radio.Group>
        </FormItem>
        <FormItem label="发布类型" field="publishType" rules={[{ required: true }]}>
          <Radio.Group defaultValue={publishType[0]?.value}>
            {publishType.map((item) => {
              return <Radio value={item?.value}>{item?.label}</Radio>;
            })}
          </Radio.Group>
        </FormItem>
        <FormItem label="App版本号" field="appVersion">
          <Input placeholder="请输入App版本号" />
        </FormItem>
        <FormItem label="App图标" field="appIcon" rules={[{ required: true }]}>
          <Upload
            multiple={false}
            limit={1}
            imagePreview
            defaultFileList={[]}
            action="/"
            listType="picture-card"
          />
        </FormItem>
        <FormItem label="App截图" field="appScreenshot">
          <Upload
            multiple
            limit={2}
            imagePreview
            defaultFileList={[]}
            action="/"
            listType="picture-card"
          />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 24 }}
            onClick={onSubmit}
            onSubmit={form.submit}>
            {params?.type === "edit" ? "更新" : "提交"}
          </Button>
          <Button
            style={{ marginRight: 24 }}
            onClick={() => {
              navigate("/appMarket");
            }}>
            返回
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
}

export default EditAPPPage;
