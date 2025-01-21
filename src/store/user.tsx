import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  password: string;  
  avatar: string;
  role: "admin" | "user" | "";
  created_at: string;
}

interface UserStore {
  user: User;
  setUser: (user: User) => void;
  initializeUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: {
    id: "",
    username: "未登录",
    nickname: "",
    email: "",
    avatar: "",
    role: "",
    password: '',
    created_at: ''
  },
  setUser: (_user) => {
    localStorage.setItem('user', JSON.stringify(_user));
    set(() => ({ user: _user }));
  },
  initializeUser: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      set(() => ({ user: parsedUser }));
    }
  },
}));

// 初始化用户信息
useUserStore.getState().initializeUser();

export default useUserStore;