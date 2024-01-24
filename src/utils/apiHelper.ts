import axios from "axios";

const instance = axios.create();

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("error :>> ", error);
    return Promise.reject(error);
  }
);

type Method = "get" | "post" | "put" | "delete" | "patch";

const callApi = async <T>({
  headers,
  url,
  method,
  payload
}: {
  headers?: any;
  url: string;
  method: Method;
  payload?: any;
}) => {
  const { data, status } = await instance<T>({
    url,
    method,
    data: payload,
    headers
  });

  return { data, status };
};

export const get = <T>({ url, headers = {} }: { url: string; headers?: any }) =>
  callApi<T>({ method: "get", url, headers });

export const post = <T>({
  url,
  payload,
  headers = {}
}: {
  url: string;
  payload?: any;
  headers?: any;
}) => callApi<T>({ method: "post", url, payload, headers });
