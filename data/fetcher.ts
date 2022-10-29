import axios, { AxiosRequestConfig } from "axios";

export function fetcher<DATA>(
  request: AxiosRequestConfig | string
): Promise<DATA> {
  const requestConfig: AxiosRequestConfig =
    typeof request === "string"
      ? {
          url: request,
          method: "GET",
        }
      : request;

  return axios
    .request(requestConfig)
    .then((resp) => resp.data)
    .catch((err) => {
      console.error({ err });
      throw {
        name: "500",
        message: "Server error",
      };
    });
}
