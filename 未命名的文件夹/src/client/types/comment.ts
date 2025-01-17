export interface Comment {
  id: number;
  content: string;
  userId: number;
  appId: number;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    avatar?: string;
  };
}
