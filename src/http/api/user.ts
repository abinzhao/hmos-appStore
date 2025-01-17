import { httpFront, httpOther } from "../instance"

async function experience() {
  const response = await httpOther.post("/log/create", { funcId: "1" })
  return response
}

async function login(params: { username: string; password: string }) {
  const response = await httpFront.post("/api/login", params)
  return response
}

async function register(params: { phone: string; username: string; password: string }) {
  const response = await httpFront.post("/api/register", params)
  return response
}

async function getUser(id: any) {
  const response = await httpFront.get(`/api/user?userId=${id}`)
  return response
}

export default { experience, login, register, getUser }
