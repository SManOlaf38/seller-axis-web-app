import fetchClient from '@/utils/fetchClient';

export const getProductAliasService = async ({
  search,
  page,
  rowsPerPage,
  sortBy,
}: {
  search: string;
  page: number;
  rowsPerPage: number;
  sortBy: string;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `product-aliases?ordering=${sortBy}&search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};
