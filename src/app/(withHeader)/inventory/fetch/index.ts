import fetchClient from '@/utils/fetchClient';

export const getProductAliasService = async ({
  search,
  page,
  rowsPerPage
}: {
  search: string;
  page: number;
  rowsPerPage: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `product-aliases?search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};
