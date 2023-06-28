import fetchClient from "@/utils/fetchClient";

export const getWarehouseService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `/warehouses`,
  );
};

