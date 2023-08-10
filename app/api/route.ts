type Method = "GET" | "POST" | "PUT" | "DELETE";

class ApiService {
  private baseUrl: string | undefined;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  private async request<T>(
    url: string,
    method: Method,
    body?: any,
    params?: any
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const version = url.split("/")[0];
    const isIntegrationVersion = version !== "v1";
    const isVersionv1_5 = version === "v1.5";

    if (isIntegrationVersion) {
      if (isVersionv1_5) this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL_V15;
    } else this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (typeof window !== "undefined") {
      if (localStorage.getItem("access_token")) {
        options.headers = {
          ...options.headers,
          Authorization: isIntegrationVersion
            ? "00f784b5ac7a47df8af3400af46377d0"
            : `Bearer ${localStorage.getItem("access_token")}`,
        };
      }
    }

    if (params) {
      url = `${url}?${toQueryString(params)}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }
    if (body && method === "POST" && url === "token") {
      options.body = new URLSearchParams(body);
    }

    const response = await fetch(this.baseUrl + url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response}`);
    }

    // If no content returned (204 status), resolve the promise with null
    if (response.status === 204) return null as T;

    const data = await response.json();
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return data;
  }

  public get<T>(url: string, query?: any): Promise<T> {
    return this.request<T>(url, "GET", undefined, query);
  }

  public post<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, "POST", data);
  }

  public update<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, "PUT", data);
  }

  public delete<T>(url: string): Promise<T> {
    return this.request<T>(url, "DELETE");
  }
}

function toQueryString(params: any): string {
  return Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map(
            (v) => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`
          )
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join("&");
}

export default ApiService;