import Cookies from "js-cookie";

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

  public isTokenExpired(token: string) {
    const tokenData: any = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    let result: boolean;

    if (tokenData.exp * 1000 < Date.now()) {
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  private async request<T>(
    url: string,
    method: Method,
    body?: any,
    params?: any
  ): Promise<T> {
    let options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const version = url.split("/")[0];
    const isIntegrationVersion = version !== "v1";
    const isVersionv1_5 = version === "v1.5";
    let refreshToken;

    if (isIntegrationVersion) {
      if (isVersionv1_5) this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL_V15;
    } else this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (typeof window !== "undefined") {
      let token = localStorage.getItem("access_token");
      refreshToken = localStorage.getItem("refresh_token");
      if (token && this.isTokenExpired(token)) {
        const refresh_body = {
          refresh_token: refreshToken,
          grant_type: "refresh_token",
          client_id: "adminApp",
        };
        options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
        // @ts-ignore
        options.body = new URLSearchParams(refresh_body);
        let refreshResponse = await fetch(this.baseUrl + "token", options);
        refreshResponse = await refreshResponse.json();
        // @ts-ignore
        if (refreshResponse.access_token !== undefined) {
          // @ts-ignore
          localStorage.setItem("access_token", refreshResponse.access_token);
          // @ts-ignore
          token = refreshResponse.access_token;
        }
        // @ts-ignore
        if (refreshResponse.refresh_token !== undefined) {
          // @ts-ignore
          localStorage.setItem("refresh_token", refreshResponse.refresh_token);
        }
        // @ts-ignore
        if (refreshResponse.access_token !== undefined) {
          // @ts-ignore
          Cookies.set("token", refreshResponse.access_token);
        }
      }
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: isIntegrationVersion
            ? "00f784b5ac7a47df8af3400af46377d0"
            : `Bearer ${token}`,
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
