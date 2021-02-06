import axios, { AxiosRequestConfig } from 'axios';

export interface AxiosReturnType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: boolean;
  status: number;
}

const axiosRequest = async (req: AxiosRequestConfig): Promise<AxiosReturnType> => {
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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
    } else {
      console.error(error);
    }
    return {
      data: error.response ? error.response.data || null : null,
      error: true,
      status: (error.response || {}).status || 404,
    };
  }
};

export { axiosRequest };
