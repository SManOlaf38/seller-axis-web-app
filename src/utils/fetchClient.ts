import Cookies from 'js-cookie';

interface CustomRequestInit extends RequestInit {
  parseResponse?: boolean;
}

class httpFetchClient {
  private _baseURL: string;
  private _headers: Record<string, string>;
  private refreshingToken: boolean;
  private retryQueue: Array<() => Promise<any>>;

  constructor(options: { baseURL?: string; headers?: Record<string, string> } = {}) {
    this._baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_ENDPOINT || '';
    this._headers = options.headers || {};
    this.refreshingToken = false;
    this.retryQueue = [];

    if (Cookies.get('token')) {
      const token = Cookies.get('token');
      token && this.setBearerAuth(token);
    }

    if (Cookies.get('current_organizations')) {
      const current_organizations = Cookies.get('current_organizations');
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

    if (res.status === 401 && !res.url.includes('auth/login')) {
      const errorResponse = await res.json();
      const errorMessage = errorResponse.detail || res.statusText;
      if (!this.refreshingToken) {
        return this.retry(endpoint, options);
      } else {
        Cookies.remove('token');
        Cookies.remove('refresh_token');
        Cookies.remove('current_organizations');
        window.location.replace('/auth/login');
        throw new Error('Token refresh failed');
      }
    }

    if (!res.ok) {
      const errorResponse = await res.json();

      let errorMessage = null;

      try {
        if (Array.isArray(errorResponse?.detail)) {
          let errorList = errorResponse.detail;
  
          if (!Array.isArray(errorResponse.detail)) {
            errorList = [errorResponse.detail];
          }
  
          errorMessage =  [...new Set(errorList.map((detail: { [key: string]: string; }) => Object.keys(detail).map((key) => `${key} - ${detail[key]}`)).flat(1))].join("\n");
        }
      } catch (err) {
        console.log(err);
      }

      if (!errorMessage) {
        errorMessage =
          errorResponse.detail?.response?.errors[0]?.message ||
          errorResponse.detail?.errors?.[0]?.message ||
          errorResponse.detail ||
          errorResponse.data ||
          res.statusText ||
          errorResponse.non_field_errors;
      }

      throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
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

    const token = Cookies.get('refresh_token');

    if (token) {
      this.refreshingToken = true;

      return this.post('auth/refresh-token', { refresh: token })
        .then((response) => {
          const newToken = response.access;
          if (newToken) {
            Cookies.set('token', newToken);
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

export default httpFetchClient;
