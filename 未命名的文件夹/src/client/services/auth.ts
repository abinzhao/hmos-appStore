import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const login = async (data: { username: string; password: string }) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const register = async (data: { username: string; password: string; email: string }) => {
  const response = await api.post('/register', data);
  return response.data;
};
