export class ApiError<TData = unknown> extends Error {
  readonly data: TData;
  readonly status: number;

  constructor(status: number, data: TData) {
    super(`API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export type ErrorType<TData> = ApiError<TData>;

const requestUrl = (path: string) => {
  if (typeof document !== "undefined") return path;

  const backendUrl = process.env["BACKEND_URL"] ?? "http://localhost:30000";
  return new URL(path, backendUrl).toString();
};

export const apiFetch = async <T>(path: string, options: RequestInit): Promise<T> => {
  const response = await fetch(requestUrl(path), {
    ...options,
    credentials: options.credentials ?? "same-origin",
  });
  const text = await response.text();
  const data = text.length === 0 ? undefined : JSON.parse(text);

  if (!response.ok) throw new ApiError(response.status, data);
  return data;
};
