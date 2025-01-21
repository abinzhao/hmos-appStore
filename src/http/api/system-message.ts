import { httpFront } from "../instance";

interface SystemMessage {
  message_text: string;
  user_id?: number;
}

interface GetMessagesParams {
  page?: number;
  pageSize?: number;
}

// 创建系统消息
async function createSystemMessage(data: SystemMessage) {
  const response = await httpFront.post("/api/system-message", data);
  return response;
}

// 获取系统消息列表
async function getSystemMessages(params: GetMessagesParams = {}) {
  console.log(params)
  const { page = 1, pageSize = 10 } = params;
  const response = await httpFront.post("/api/system-messages", params);
  return response;
}

// 获取单个系统消息详情
async function getSystemMessageDetail(id: string | number) {
  const response = await httpFront.get(`/api/system-message/${id}`);
  return response;
}

// 更新系统消息
async function updateSystemMessage(data: SystemMessage) {
  const response = await httpFront.post(`/api/system-message/update`, data);
  return response;
}

// 删除系统消息
async function deleteSystemMessage(id: string | number) {
  const response = await httpFront.delete(`/api/system-message/${id}`);
  return response;
}

// 批量删除系统消息
async function batchDeleteSystemMessages(ids: (string | number)[]) {
  const response = await httpFront.post("/api/system-messages/batch-delete", { ids });
  return response;
}

export default {
  createSystemMessage,
  getSystemMessages,
  getSystemMessageDetail,
  updateSystemMessage,
  deleteSystemMessage,
  batchDeleteSystemMessages
}; 