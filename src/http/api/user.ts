import { httpFront, httpOther } from "../instance"

async function experience() {
  const response = await httpOther.post("/log/create", { funcId: "1" })
  return response
}

async function login(params: { username: string; password: string }) {
  const response = await httpFront.post("/api/login", params)
  return response
}

async function register(params: { email: string; username: string; password: string }) {
  const response = await httpFront.post("/api/register", params)
  return response
}

async function getUser(id: any) {
  const response = await httpFront.get(`/api/user?userId=${id}`)
  return response
}

async function getCurrentUser() {
  const response = await httpFront.get(`/api/current-user`)
  return response
}

async function updateUser(params: {
  id: number;
  username: string;
  email?: string;
  nickname?: string;
  avatar?: string;
}) {
  const response = await httpFront.post('/api/admin/user/update', params);
  return response;
}

interface GetUsersParams {
  page: number;
  pageSize: number;
  keyword?: string;
  search?: string;
  role?: 'admin' | 'user';
}

async function getAllUsers(params: GetUsersParams) {
  const response = await httpFront.post('/api/admin/users', params);
  return response;
}

async function resetUserPassword(userId: string) {
  const response = await httpFront.post(`/api/users/${userId}/reset-password`);
  return response;
}

async function createUser(params: {
  username: string;
  nickname: string;
  email: string;
  password: string;
  user_role: 'admin' | 'user';
}) {
  const response = await httpFront.post('/api/register', params);
  return response;
}

async function deleteUser(id: string) {
  const params = { id };
  const response = await httpFront.post(`/api/admin/user/delete`, params);
  return response;
}


async function editUser(params: {
  email?: string;
  nickname?: string;
  avatar?: string;
}) {
  const response = await httpFront.post('/api/user/update', params);
  return response;
}

export default { experience, login, register, getUser, getCurrentUser, updateUser, getAllUsers, resetUserPassword, createUser, deleteUser, editUser }
