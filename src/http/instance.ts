import { useHttpClient, HttpClient } from './common';
import { Message } from '@arco-design/web-react';

const frontBaseURL = 'http://8.140.239.170:8081';

const httpOther: HttpClient = useHttpClient({ baseURL: 'http://www.monitor.okoknb.cn' });

const httpFront: HttpClient = useHttpClient({ baseURL: frontBaseURL });
httpFront.onRequestSuccess(response => {});
httpFront.onRequestError(error => {
  Message.error(error.message);
});
httpFront.onResponseSuccess(response => {
  return response.data;
});
httpFront.onResponseError(error => {
  if (error?.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = window.location.origin + '/login';
  } else {
    const errorData = error?.response?.data as { message: string };
    const message = errorData?.message;
    const responseMessage = error?.response?.data?.error;
    Message.error(`${error.message}: ${responseMessage || ''}`);
  }
});

export { httpFront, httpOther, frontBaseURL };
