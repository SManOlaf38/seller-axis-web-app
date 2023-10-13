import fetchClient from '@/utils/fetchClient';

export const getProductAliasService = async ({
  search,
  page,
  rowsPerPage,
  sortingColumn,
  isASCSort,
}: {
  search: string;
  page: number;
  rowsPerPage: number;
  sortingColumn: string;
  isASCSort: boolean;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `product-aliases?ordering=${isASCSort ? '' : "-"}${sortingColumn}&search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};
