import { cookies } from 'next/headers';
import httpFetch from '@/utils/fetchRestAPI';

export const getOrganizationDetailServer = async (id: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (token) {
    const httpFetchClient = new httpFetch({
      headerToken: JSON.parse(token)
    });
    return await {
      name: 'string',
      avatar: 'string',
      description: 'string',
      address: 'string',
      email: 'string',
      phone: 'string',
      status: 'string',
    }
  }
}