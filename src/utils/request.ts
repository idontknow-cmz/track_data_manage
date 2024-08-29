const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

interface IRequestOptions {
  method: string;
  headers: Record<string, any>;
  [key: string]: any;
}
export const request = (
  url: string,
  data?: Record<string, any>,
  options?: IRequestOptions
) => {
  const requestOptions = {
    method: options?.method || "POST",
    headers: {
      ...DEFAULT_HEADERS,
      ...(options?.headers || {}),
    },
    body: JSON.stringify(data),
  };
  return fetch(url, requestOptions).then((res) => res.json());
};
