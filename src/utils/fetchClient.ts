import Cookies from 'js-cookie';

interface CustomRequestInit extends RequestInit {
  parseResponse?: boolean;
}

class httpFetchClient {
  private _baseURL: string;
  private _headers: Record<string, string>;

  constructor(options: { baseURL?: string; headers?: Record<string, string> } = {}) {
    this._baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_ENDPOINT || '';
    this._headers = options.headers || {};

    if (Cookies.get('token')) {
      const token = Cookies.get('token')?.replaceAll('"', '');
      token && this.setBearerAuth(token);
    }

    if (Cookies.get('current_organizations')) {
      const current_organizations = Cookies.get('current_organizations')?.replaceAll('"', '');
      current_organizations && this.setHeader('organization', current_organizations);
    }
  }

  private async _fetchJSON(endpoint: string, options: CustomRequestInit = {}): Promise<any> {
    const res = await fetch(this._baseURL + endpoint, {
      ...options,
      headers: {
        ...this._headers,
        'Content-Type': 'application/json'
      }
      // cache: 'force-cache',
      // next: { revalidate: 900 },
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      const errorMessage = errorResponse.detail || res.statusText;
      throw new Error(errorMessage);
    }
    if (options.parseResponse !== false && res.status !== 204) return res.json();

    if (res.status === 401) {
      this.refreshToken();
    }

    return undefined;
  }

  private refreshToken(): void {
    const token = Cookies.get('refresh_token')?.replaceAll('"', '');

    if (token) {
      this.post('auth/refresh-token', { refresh: token })
        .then((response) => {
          const newToken = response.token;

          if (newToken) {
            Cookies.set('token', JSON.stringify(newToken));
            this.setBearerAuth(newToken);
          }
        })
        .catch((error) => {
          console.error('Token refresh failed:', error.message);
        });
    }
  }

  public setHeader(key: string, value: string): this {
    this._headers[key] = value;
    return this;
  }

  public getHeader(key: string): string | undefined {
    return this._headers[key];
  }

  public setBearerAuth(token: string | undefined): this {
    this._headers.Authorization = `Bearer ${token}`;
    return this;
  }

  public get(endpoint: string, options: CustomRequestInit = {}): Promise<any> {
    return this._fetchJSON(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  public post(endpoint: string, body?: any, options: CustomRequestInit = {}): Promise<any> {
    return this._fetchJSON(endpoint, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
      method: 'POST'
    });
  }

  public put(endpoint: string, body?: any, options: CustomRequestInit = {}): Promise<any> {
    return this._fetchJSON(endpoint, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
      method: 'PUT'
    });
  }

  public patch(endpoint: string, operations: any, options: CustomRequestInit = {}): Promise<any> {
    return this._fetchJSON(endpoint, {
      parseResponse: false,
      ...options,
      body: JSON.stringify(operations),
      method: 'PATCH'
    });
  }

  public delete(endpoint: string, options: CustomRequestInit = {}): Promise<any> {
    return this._fetchJSON(endpoint, {
      parseResponse: false,
      ...options,
      method: 'DELETE'
    });
  }
}

export default httpFetchClient;
