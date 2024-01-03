import fetchClient from '@/utils/fetchClient';
import { getURLSearchParams } from '@/utils/utils';

export const getListOrderService = async ({
  search,
  page,
  rowsPerPage
}: {
  search: string;
  page: number;
  rowsPerPage: number;
}) => {
  const httpFetchClient = fetchClient();

  const queryParams = getURLSearchParams({
    ordering: '-created_at',
    search,
    offset: page * rowsPerPage,
    limit: rowsPerPage
  });

  return await httpFetchClient.get(`retailer-purchase-orders/search${queryParams}`);
};

export const getListOrderReturnService = async ({
  search,
  page,
  rowsPerPage
}: {
  search: string;
  page: number;
  rowsPerPage: number;
}) => {
  const httpFetchClient = fetchClient();

  const queryParams = getURLSearchParams({
    ordering: '-created_at',
    search,
    offset: page * rowsPerPage,
    limit: rowsPerPage
  });

  return await httpFetchClient.get(`retailer-purchase-order-returns?${queryParams}`);
};
