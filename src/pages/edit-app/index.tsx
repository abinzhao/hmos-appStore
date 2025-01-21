import { useTranslation } from "react-i18next";
import { Form, Input, Button, Card, Radio, Upload, Message } from "@arco-design/web-react";
import "./index.scss";
import { appCategory, publishType } from "./contants";
import { useNavigate } from "react-router-dom";
import { appMarketRequest } from "../../http/api";
import { getUrlParams } from "../../utils";
import { useEffect, useState } from "react";
import { frontBaseURL, httpFront } from "../../http/instance";
import {
  IconClose,
  IconEdit,
  IconFaceFrownFill,
  IconFileAudio,
  IconPlus,
} from "@arco-design/web-react/icon";
import React from "react";

const FormItem = Form.Item;

function EditAPPPage() {
  const [appCategoryValue, setAppCategoryValue] = useState<string>("其他");
  const [icon, setIcon] = React.useState<any>({});
  const csIcon = `arco-upload-list-item${icon && icon.status === "error" ? " is-error" : ""}`;
  const [screenshot, setScreenshot] = React.useState<any>();
  const csScreenshot = `arco-upload-list-item${
    screenshot && screenshot?.status === "error" ? " is-error" : ""
  }`;
  const [file, setFile] = React.useState<any>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = getUrlParams(window.location.href);
  const [tPublishType, setTPublishType] = useState<string>("0");

  const getDetail = async () => {
    if (!params?.id) return;
    try {
      const res = await appMarketRequest.getAppDetail({ id: params?.id });

      // 如果 app_category 是 JSON 字符串，需要解析它
      //const categoryValue = JSON.parse(JSON.parse(res.data.app_category));
      const categoryValue = res.data.app_category;
      // 设置基本表单数据，包括 app_category
      form.setFieldsValue({
        ...res.data,
        app_category: categoryValue, // 直接设置解析后的值
      });

      // 更新状态
      setAppCategoryValue(categoryValue);
      setTPublishType(res.data.publish_type);
      setIcon({
        uid: "-1", // 唯一标识
        name: res.data.app_icon.split("/").pop(), // 从路径中提取文件名
        url: `${frontBaseURL}/${res.data.app_icon}`, // 完整的文件URL
        status: "done",
      });
      setScreenshot({
        uid: "-2", // 唯一标识
        name: res.data.app_screenshot.split("/").pop(), // 从路径中提取文件名
        url: `${frontBaseURL}/${res.data.app_screenshot}`, // 完整的文件URL
        status: "done",
      });
      setFile({
        uid: "-3", // 唯一标识
        name: res.data.app_file_url.split("/").pop(), // 从路径中提取文件名
        url: `${frontBaseURL}/${res.data.app_file_url}`, // 完整的文件URL
        status: "done",
      });
    } catch (error: any) {
      Message.error(error?.message || t("APIerror"));
    }
  };

  const onSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      // 如果需要将 app_category 转换为 JSON 字符串
      const submitValues: any = {
        ...values,
        app_category: values.app_category,
        publish_type: tPublishType,
        app_icon: icon?.originUrlInfo,
        app_screenshot: screenshot?.originUrlInfo,
        app_file_url: file?.originUrlInfo,
      };

      if (!params?.id) {
        const res = await appMarketRequest.setApp(submitValues);
        console.log("🚀 ~ onSubmit ~ res:", res);
        Message.success("创建成功");
        navigate("/appMarket");
        return;
      }
      submitValues.id = params?.id;
      const res = await appMarketRequest.updateApp(submitValues);
      console.log("🚀 ~ onSubmit ~ res:", res);
      Message.success("更新成功");
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleFileUpload = async (file: string | Blob, type: string | Blob) => {
    try {
      const formData = new FormData();
      formData.append("packageName", form.getFieldValue("app_package_name"));
      formData.append("type", type);
      formData.append("file", file);

      const response = await httpFront.post("/api/upload", formData, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.link; // 返回文件的外部链接
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  };

  // 处理文件变化的函数，现在考虑了多种文件类型和多个文件的情况
  const handleFileChange = async (fileList: any, currentFile: any, type: any) => {
    try {
      if (!fileList || fileList.length === 0) {
        form.setFieldValue(
          type === "icon" ? "appIcon" : type === "screenshot" ? "appScreenshot" : "file",
          ""
        );
        return;
      }

      const validFiles = await Promise.all(
        fileList.map(async (file: any) => {
          if (file.status === "done") {
            return file;
          } else if (file.status === "uploading") {
            const link = await handleFileUpload(file.originFile, type);
            return link;
          }
          return null;
        })
      );

      // 如果是多图，则保留所有有效的链接；否则只保留第一个有效链接
      const validLinks = validFiles.filter((link) => link);

      form.setFieldValue(
        type === "icon" ? "appIcon" : type === "screenshot" ? "appScreenshot" : "appFileUrl",
        type === "screenshot" ? validLinks[0] : validFiles[0] || ""
      );
      if (type === "screenshot") {
        setScreenshot({
          ...currentFile,
          url: `${frontBaseURL}/${validFiles[0]}`,
          originUrlInfo: validFiles[0], // 保存原始链接信息
        });
      } else if (type === "icon") {
        setIcon({
          ...currentFile,
          url: `${frontBaseURL}/${validFiles[0]}`,
          originUrlInfo: validFiles[0], // 保存原始链接信息
        });
      } else if (type === "file") {
        setFile({
          ...currentFile,
          url: `${frontBaseURL}/${validFiles[0]}`,
          originUrlInfo: validFiles[0], // 保存原始链接信息
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 动态获取上传属性的函数，现在接收三个参数：type, limit, multiple
  const uploadProps = (type: any, limit = 1, multiple = false) => ({
    name: "file",
    accept: type === "file" ? ".apk,.hap" : "image/*", // 根据类型设定接受的文件格式
    multiple,
    beforeUpload: (file: any) => {
      if (type === "file") {
        const isValidType =
          file.type === "application/vnd.android.package-archive" || file.name.endsWith(".hap");
        if (!isValidType) {
          Message.error(`只能上传APK或HAP文件!`);
          return false;
        }
      }
      return true;
    },
    onProgress: (currentFile: any) => {
      if (type === "screenshot") {
        setScreenshot(currentFile);
      } else if (type === "icon") {
        setIcon(currentFile);
      } else if (type === "file") {
        setFile(currentFile);
      }
    },
    onChange: async (info: any, currentFile: any) => {
      await handleFileChange(info, currentFile, type);
    },
    listType: type !== "file" ? "picture-card" : "text", // 包文件采用文本列表类型
    limit,
  });

  const handleAppCategoryChange = (value: string) => {
    setAppCategoryValue(value);
    // 直接设置原始值，不需要 JSON.stringify
    form.setFieldValue("app_category", value);
  };
  const handleAppPublishTypeChange = (value: string) => {
    setTPublishType(value);
    // 直接设置原始值，不需要 JSON.stringify
    form.setFieldValue("public_type", value);
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
          //publishType: publishType[0]?.value,
          appVersion: "1.0.0",
        }}
        autoComplete="off">
        <FormItem label="包名" field="app_package_name" rules={[{ required: true }]}>
          <Input placeholder="请输入包名称" />
        </FormItem>
        <FormItem label="App名称" field="app_name" rules={[{ required: true }]}>
          <Input placeholder="请输入App名称" />
        </FormItem>
        <FormItem label="App介绍" field="app_description" rules={[{ required: true }]}>
          <Input placeholder="请输入App详情信息" />
        </FormItem>
        <FormItem label="App分类" field="app_category" rules={[{ required: true }]}>
          <Radio.Group value={appCategoryValue} onChange={handleAppCategoryChange}>
            {appCategory.map((item) => (
              <Radio key={item?.value} value={item?.value}>
                {item?.label}
              </Radio>
            ))}
          </Radio.Group>
        </FormItem>
        <FormItem label="发布类型" field="publish_type" rules={[{ required: true }]}>
          {tPublishType && ""}
          <Radio.Group value={tPublishType} onChange={handleAppPublishTypeChange}>
            {publishType.map((item) => {
              return (
                <Radio key={item?.value} value={item?.value}>
                  {item?.label}
                </Radio>
              );
            })}
          </Radio.Group>
        </FormItem>
        <FormItem label="App版本号" field="app_version">
          <Input placeholder="请输入App版本号" />
        </FormItem>
        <FormItem label="App图标" field="app_icon">
          <Upload
            fileList={icon ? [icon] : []}
            showUploadList={false}
            onChange={async (info, currentFile) => {
              await handleFileChange(info, currentFile, "icon");
            }}
            listType="picture-card">
            <div className={csIcon}>
              {icon && icon?.url ? (
                <div className="arco-upload-list-item-picture custom-upload-avatar">
                  <img src={icon?.url} />
                  <div className="arco-upload-list-item-picture-mask">
                    <IconEdit />
                  </div>
                </div>
              ) : (
                <div className="arco-upload-trigger-picture">
                  <div className="arco-upload-trigger-picture-text">
                    <IconPlus />
                    <div style={{ marginTop: 10, fontWeight: 600 }}>Upload</div>
                  </div>
                </div>
              )}
            </div>
          </Upload>
        </FormItem>
        <FormItem label="App截图" field="app_screenshot">
          <Upload
            onChange={async (info, currentFile) => {
              await handleFileChange(info, currentFile, "screenshot");
            }}
            listType="picture-card"
            showUploadList={false}
            fileList={screenshot ? [screenshot] : []}>
            <div className={csScreenshot}>
              {screenshot && screenshot?.url ? (
                <div className="arco-upload-list-item-picture custom-upload-avatar">
                  <img src={screenshot?.url} />
                  <div className="arco-upload-list-item-picture-mask">
                    <IconEdit />
                  </div>
                </div>
              ) : (
                <div className="arco-upload-trigger-picture">
                  <div className="arco-upload-trigger-picture-text">
                    <IconPlus />
                    <div style={{ marginTop: 10, fontWeight: 600 }}>Upload</div>
                  </div>
                </div>
              )}
            </div>
          </Upload>
        </FormItem>
        <FormItem label="应用包" field="app_file_url">
          <Upload
            {...uploadProps("file")}
            listType="text"
            multiple
            fileList={file ? [file] : []}
            showUploadList={{
              // Please dont remove this comment
              fileIcon: <IconFileAudio />,
              removeIcon: <IconClose onClick={() => setFile(null)} />,
              previewIcon: null,
              errorIcon: <IconFaceFrownFill />,
              fileName: (file) => {
                return (
                  <a
                    onClick={() => {
                      const tempUrl = file.url?.split(frontBaseURL)[1];
                      const tempUrlArr = tempUrl?.split("/") || [];
                      const type = tempUrlArr[2] || "";
                      const packageName = tempUrlArr[3] || "";
                      const fileName = tempUrlArr[4] || "";
                      console.log("tempUrlArr", tempUrlArr);
                      if (type && packageName && fileName) {
                        appMarketRequest.downloadFile(type, packageName, fileName, params?.id);
                      } else {
                        console.error("Invalid URL structure:", file.url);
                      }
                    }}>
                    {file.name}
                  </a>
                );
              },
            }}>
            <Button type="primary">
              {form.getFieldValue("appPackage") ? "更改APK" : "点击上传APK"}
            </Button>
          </Upload>
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
