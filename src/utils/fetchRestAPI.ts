import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface CustomRequestInit extends RequestInit {
  parseResponse?: boolean;
}

class httpFetch {
  private _baseURL: string;
  private _headers: Record<string, string>;
  private refreshingToken: boolean;
  private retryQueue: Array<() => Promise<any>>;

  constructor(options: { baseURL?: string; headers?: Record<string, string> } = {}) {
    this._baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_ENDPOINT || '';
    this._headers = options.headers || {};
    this.refreshingToken = false;
    this.retryQueue = [];

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    const current_organizations = cookieStore.get('current_organizations')?.value;

    if (token) {
      token && this.setBearerAuth(token);
    }

    if (current_organizations) {
      current_organizations && this.setHeader('organization', current_organizations);
    }
  }

  private async _fetchJSON(endpoint: string, options: CustomRequestInit = {}): Promise<any> {
    const res = await fetch(this._baseURL + endpoint, {
      ...options,
      headers: {
        ...this._headers
      }
    });

    if (res.status === 401 && !res.url.includes('auth/login')) {
      const errorResponse = await res.json();
      const errorMessage = errorResponse.detail || res.statusText;
      if (!this.refreshingToken) {
        return this.retry(endpoint, options);
      } else {
        const cookieStore = cookies();
        cookieStore.set({
          name: 'token',
          value: ''
        });
        cookieStore.set({
          name: 'refresh_token',
          value: ''
        });
        cookieStore.set({
          name: 'current_organizations',
          value: ''
        });
        window.location.replace('/auth/login');
        redirect('/auth/login');
      }
    }

    if (!res.ok) {
      const errorResponse = await res.json();

      const errorMessage = errorResponse.detail || res.statusText;
      throw new Error(errorMessage);
    }
    if (options.parseResponse !== false && res.status !== 204) return res.json();

    return undefined;
  }

  private async refreshToken(): Promise<void> {
    if (this.refreshingToken) {
      await new Promise<void>((resolve) => {
        const intervalId = setInterval(() => {
          if (!this.refreshingToken) {
            clearInterval(intervalId);
            resolve();
          }
        }, 100);
      });
      return;
    }
    const cookieStore = cookies();
    const token = cookieStore.get('refresh_token')?.value;

    if (token) {
      this.refreshingToken = true;

      return this.post('auth/refresh-token', { refresh: token })
        .then((response) => {
          const newToken = response.access;
          if (newToken) {
            cookieStore.set({
              name: 'token',
              value: newToken
            });
            this.setBearerAuth(newToken);
            this.refreshingToken = false;
            while (this.retryQueue.length > 0) {
              const retryRequest = this.retryQueue.shift();
              if (retryRequest) {
                retryRequest();
              }
            }
          }
        })
        .catch((error) => {
          console.error('Token refresh failed:', error.message);
          this.refreshingToken = false;
        });
    }
  }

  private async retry(endpoint: string, options: CustomRequestInit): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const retryRequest = async () => {
        try {
          const response = await this._fetchJSON(endpoint, options);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };

      this.retryQueue.push(retryRequest);

      if (!this.refreshingToken && this.retryQueue.length === 1) {
        this.refreshToken()
          .then(() => {
            retryRequest();
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
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

export default httpFetch;
