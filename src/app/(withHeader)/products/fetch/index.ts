import fetchClient from '@/utils/fetchClient';

// Rest API

export const getProductService = async ({
  search,
  currentPage,
}: {
  search: string;
  currentPage: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `/product?search=${search}&page=${currentPage}&page_size=10`,
  );
};
