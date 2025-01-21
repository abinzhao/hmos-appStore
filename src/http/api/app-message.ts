import { httpFront } from "../instance";

interface AppMessage {
  message_text: string;
  app_id: string | number;
}

interface GetMessagesParams {
  page?: number;
  pageSize?: number;
}

// 发送应用留言
async function sendAppMessage(data: AppMessage) {
  const response = await httpFront.post("/api/app-message/create", data);
  return response;
}

async function getAllMessages(params: GetMessagesParams = {}) {
  const response = await httpFront.post("/api/all-messages", params);
  return response;
}

// 获取我的所有留言
async function getMyMessages(params: GetMessagesParams = {}) {
  const response = await httpFront.post("/api/my-messages", params);
  return response;
}

// 获取用户反馈
async function getUserFeedbackMessages(params: GetMessagesParams = {}) {
  const response = await httpFront.post("/api/my-app-messages", params);
  return response;
}


// 获取应用的所有留言
async function getAppMessages(appId: string | number, params: GetMessagesParams = {}) {
  const response = await httpFront.post(`/api/app-messages/${appId}`, params);
  return response;
}

// 删除留言
async function deleteMessage(id: string | number) {
  const response = await httpFront.post("/api/delete-message", { id });
  return response;
}

// 更新留言
async function updateMessage(appMessage: AppMessage) {
  const response = await httpFront.post("/api/update-message", appMessage);
  return response;
}

export default {
  sendAppMessage,
  getMyMessages,
  getAppMessages,
  deleteMessage,
  updateMessage,
  getUserFeedbackMessages,
  getAllMessages
}; 