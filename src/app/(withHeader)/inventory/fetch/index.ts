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
    `product-aliases?ordering=-created_at&search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};
