import request from '../utils/request';

export interface UserData {
  id?: number;
  username: string;
  email: string;
  role?: 'user' | 'admin';
  createdAt?: string;
}

export const userAPI = {
  login: async (credentials: { username: string; password: string }) => {
    return request.post('/login', credentials);
  },

  register: async (data: { username: string; password: string; email: string }) => {
    return request.post('/register', data);
  },

  getCurrentUser: async () => {
    return request.get<UserData>('/users/current');
  },

  getUsers: async (params?: any) => {
    return request.get<UserData[]>('/users', { params });
  },

  updateUser: async (id: number, data: Partial<UserData>) => {
    return request.put(`/users/${id}`, data);
  },

  deleteUser: async (id: number) => {
    return request.delete(`/users/${id}`);
  },

  updatePassword: async (id: number, data: { currentPassword: string; newPassword: string }) => {
    return request.put(`/users/${id}/password`, data);
  }
};
