import request from '../utils/request';

export interface AnnouncementData {
  id?: number;
  title: string;
  content: string;
  createdAt?: string;
}

export const announcementAPI = {
  getAnnouncements: async () => {
    return request.get<AnnouncementData[]>('/announcements');
  },

  createAnnouncement: async (data: AnnouncementData) => {
    return request.post<AnnouncementData>('/announcements', data);
  },

  updateAnnouncement: async (id: number, data: Partial<AnnouncementData>) => {
    return request.put(`/announcements/${id}`, data);
  },

  deleteAnnouncement: async (id: number) => {
    return request.delete(`/announcements/${id}`);
  }
};
