/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

export type AxiosReturnType<ResponseType = any> =
  | {
      data: ResponseType;
      error: false;
      status: number;
    }
  | {
      data: any;
      error: true;
      status: number;
    };

const axiosRequest = async <ResponseType = any>(req: AxiosRequestConfig): Promise<AxiosReturnType<ResponseType>> => {
  try {
    const axiosOptions = {
      baseURL: process.env.NEXT_PUBLIC_BASE_APP,
      ...req,
    };
    const res = await axios(axiosOptions);
    return {
      data: res.data,
      error: false,
      status: res.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
      } else {
        console.error(error);
      }
      return {
        data: error.response?.data ?? null,
        error: true,
        status: (error.response || {}).status || 500,
      };
    }
    return {
      data: null,
      error: true,
      status: 500,
    };
  }
};

export { axiosRequest };
