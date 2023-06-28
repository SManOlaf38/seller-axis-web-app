import { cookies } from 'next/headers';
import { isError } from './type-guards';

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

type IHeaders = {
  [key: string]: string;
};

export const endpointData = process.env.API_ENDPOINT || '';

export async function nextFetchGraphQl<T>({
  query,
  variables,
  headers,
  cache = 'force-cache',
}: {
  query?: string;
  variables?: ExtractVariables<T>;
  headers?: IHeaders;
  cache?: RequestCache;
}): Promise<{ status: number; body: T } | never> {
  try {
    const header: IHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const cookieStore = cookies();

    if (cookieStore.has('token')) {
      const token = cookieStore.get('token')?.value;
      header['authorization'] = 'token ' + token;
    }

    const result = await fetch(endpointData, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      next: { revalidate: 900 }, // 15 minutes
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return body;
  } catch (e) {
    if (isError(e)) {
      throw {
        status: e.status || 500,
        message: e.message,
        query,
      };
    }
    throw {
      error: e,
      query,
    };
  }
}
