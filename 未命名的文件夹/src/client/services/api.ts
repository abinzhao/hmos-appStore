import request from '../utils/request';

// CommentAPI 接口
export interface CommentData {
  id?: number;
  content: string;
  userId?: number;
  appId?: number;
  createdAt?: string;
  user?: {
    id: number;
    username: string;
    avatar?: string;
  };
}

// API 接口定义
export const commentAPI = {
  // 获取评论列表
  getComments: async (appId: number) => {
    return request.get<CommentData[]>(`/apps/${appId}/comments`);
  },

  // 添加评论
  addComment: async (appId: number, content: string) => {
    return request.post<CommentData>(`/apps/${appId}/comments`, { content });
  },

  // 删除评论
  deleteComment: async (appId: number, commentId: number) => {
    return request.delete(`/apps/${appId}/comments/${commentId}`);
  },

  // 更新评论
  updateComment: async (appId: number, commentId: number, content: string) => {
    return request.put(`/apps/${appId}/comments/${commentId}`, { content });
  }
};

// 其他 API 导出...
export { userAPI } from './userAPI';
export { appAPI } from './appAPI';
export { announcementAPI } from './announcementAPI';
