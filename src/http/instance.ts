import { useHttpClient, HttpClient } from "./common"
import { Message } from "@arco-design/web-react"

const httpOther: HttpClient = useHttpClient({ baseURL: "http://www.monitor.okoknb.cn" })

const httpFront: HttpClient = useHttpClient({ baseURL: "http://8.140.239.170:3004" })
httpFront.onRequestSuccess((response) => { })
httpFront.onRequestError((error) => {
  Message.error(error.message)
})
httpFront.onResponseSuccess((response) => {
  return response.data
})
httpFront.onResponseError((error) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem("token")
    window.location.href = window.location.origin + "/login"
  } else {
    const errorData = error?.response?.data as { message: string }
    const message = errorData?.message
    Message.error(message)
  }
})

export { httpFront, httpOther }
