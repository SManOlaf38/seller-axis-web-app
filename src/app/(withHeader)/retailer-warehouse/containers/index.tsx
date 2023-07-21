'use client';

import { useRouter } from 'next/navigation';

import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { useCallback, useEffect } from 'react';
import { TableRetailerWarehouse } from '../components/TableRetailerWarehouse';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch/index';

export default function RetailerWarehouseContainer() {
  const {
    state: { isLoading, dataRetailerWarehouse },
    dispatch
  } = useStore();
  const router = useRouter();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataRetailerWarehouse?.results
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/retailer-warehouse/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteRetailerWarehouseRequest());
      await services.deleteRetailerWarehouseService(id);
      dispatch(actions.deleteRetailerWarehouseSuccess(id));
      handleGetRetailerWarehouse();
    } catch (error) {
      dispatch(actions.deleteRetailerWarehouseFailure(error));
    }
  };

  const handleGetRetailerWarehouse = useCallback(async () => {
    try {
      dispatch(actions.getRetailerWarehouseRequest());
      const dataProduct = await services.getRetailerWarehouseService({
        search: debouncedSearchTerm,
        page
      });
      dispatch(actions.getRetailerWarehouseSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getRetailerWarehouseFailure(error));
    }
  }, [dispatch, page, debouncedSearchTerm]);

  useEffect(() => {
    handleGetRetailerWarehouse();
  }, [handleGetRetailerWarehouse]);

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'Retailer Warehouse'}
        onSubmit={() => router.push('/retailer-warehouse/create')}
        addTitle="Add"
      />

      <TableRetailerWarehouse
        headerTable={headerTable}
        loading={isLoading}
        dataProduct={dataRetailerWarehouse}
        selectedItems={selectedItems}
        totalCount={dataRetailerWarehouse.count}
        page={page}
        rowsPerPage={rowsPerPage}
        onSelectAll={onSelectAll}
        onSelectItem={onSelectItem}
        onPageChange={onPageChange}
        onViewDetailItem={handleViewDetailItem}
        onDeleteItem={handleDeleteItem}
      />
    </main>
  );
}
