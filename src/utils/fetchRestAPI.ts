import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

interface CustomRequestInit extends RequestInit {
  parseResponse?: boolean;
}

class httpFetch {
  private _baseURL: string;
  private _headers: Record<string, string>;

  constructor(options: { baseURL?: string; headers?: Record<string, string> } = {}) {
    this._baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_ENDPOINT || '';
    this._headers = options.headers || {};

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

    if (!res.ok) {
      notFound();
      // throw new Error('Failed to fetch data')
    }
    if (options.parseResponse !== false && res.status !== 204) return res.json();

    return undefined;
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
