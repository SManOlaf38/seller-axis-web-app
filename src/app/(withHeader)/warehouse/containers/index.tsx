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
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';

export default function RetailerWarehouseContainer() {
  const {
    state: { isLoading, dataRetailerWarehouse },
    dispatch
  } = useStore();
  const router = useRouter();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const { search, debouncedSearchTerm, handleSearch } = useSearch('warehouse');
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem, setSelectedItems } = useSelectTable({
    data: dataRetailerWarehouse?.results
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/warehouse/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteRetailerWarehouseRequest());
      await services.deleteRetailerWarehouseService(id);
      dispatch(actions.deleteRetailerWarehouseSuccess(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Warehouse Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetRetailerWarehouse();
      setSelectedItems([]);
    } catch (error: any) {
      dispatch(actions.deleteRetailerWarehouseFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Warehouse Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetRetailerWarehouse = useCallback(async () => {
    try {
      dispatch(actions.getRetailerWarehouseRequest());
      const dataProduct = await services.getRetailerWarehouseService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      dispatch(actions.getRetailerWarehouseSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getRetailerWarehouseFailure(error));
    }
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage]);

  const handleDeleteBulkItem = async (ids: number[]) => {
    try {
      dispatch(actions.deleteBulkWarehouseRequest());
      await services.deleteBulkWarehouseService(ids);
      dispatch(actions.deleteBulkWarehouseSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Bulk Warehouse Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetRetailerWarehouse();
      setSelectedItems([]);
    } catch (error: any) {
      dispatch(actions.deleteBulkWarehouseFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Bulk Warehouse Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    handleGetRetailerWarehouse();
  }, [handleGetRetailerWarehouse]);

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'Warehouse'}
        onSubmit={() => router.push('/warehouse/create')}
        addTitle="Add"
      />

      <TableRetailerWarehouse
        onChangePerPage={onChangePerPage}
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
        handleDeleteBulkItem={handleDeleteBulkItem}
      />
    </main>
  );
}
