import request from '../utils/request';

export interface AppData {
  id?: number;
  name: string;
  description?: string;
  category?: string;
  version?: string;
  iconUrl?: string;
  packageUrl?: string;
  userId?: number;
  status?: 'active' | 'inactive' | 'pending';
  downloads?: number;
  createdAt?: string;
  updatedAt?: string;
  screenshots?: string[];
}

export const appAPI = {
  getApps: async (params?: any) => {
    return request.get<AppData[]>('/apps', { params });
  },

  getAppDetails: async (id: number) => {
    return request.get<AppData>(`/apps/${id}`);
  },

  createApp: async (data: AppData) => {
    return request.post<AppData>('/apps', data);
  },

  updateApp: async (id: number, data: Partial<AppData>) => {
    return request.put(`/apps/${id}`, data);
  },

  deleteApp: async (id: number) => {
    return request.delete(`/apps/${id}`);
  },

  getStatistics: async () => {
    return request.get('/apps/statistics');
  },

  installApp: async (id: number, deviceId: string) => {
    return request.post(`/apps/${id}/install`, { deviceId });
  },

  incrementDownload: async (id: number) => {
    return request.post(`/apps/${id}/downloads`);
  },

  getConnectedDevices: async () => {
    return request.get('/devices');
  }
};
