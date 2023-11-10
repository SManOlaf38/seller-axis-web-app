'use client';

import { useRouter } from 'next/navigation';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { useCallback, useEffect } from 'react';
import { TableRetailerCarrier } from '../components/TableRetailerCarrier';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch/index';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

export default function RetailerCarrierContainer() {
  const {
    state: { isLoading, dataRetailerCarrier },
    dispatch
  } = useStore();
  const router = useRouter();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem, setSelectedItems } = useSelectTable({
    data: dataRetailerCarrier?.results
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/carriers/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteRetailerCarrierRequest());
      await services.deleteRetailerCarrierService(id);
      dispatch(actions.deleteRetailerCarrierSuccess(id));
      handleGetRetailerCarrier();
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      setSelectedItems([]);
    } catch (error: any) {
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
      dispatch(actions.deleteRetailerCarrierFailure(error));
    }
  };

  const handleDeleteBulkItem = async (ids: number[]) => {
    try {
      dispatch(actions.deleteBulkRetailerCarrierRequest());
      await services.deleteBulkCarrierService(ids);
      dispatch(actions.deleteBulkRetailerCarrierSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Bulk Carrier Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetRetailerCarrier();
      setSelectedItems([]);
    } catch (error: any) {
      dispatch(actions.deleteBulkRetailerCarrierFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Bulk Carrier Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetRetailerCarrier = useCallback(async () => {
    try {
      dispatch(actions.getRetailerCarrierRequest());
      const dataProduct = await services.getRetailerCarrierService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      dispatch(actions.getRetailerCarrierSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getRetailerCarrierFailure(error));
    }
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage]);

  useEffect(() => {
    handleGetRetailerCarrier();
  }, [handleGetRetailerCarrier]);

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'Carrier'}
        onSubmit={() => router.push('/carriers/create')}
        addTitle="Add Carrier"
      />

      <TableRetailerCarrier
        onChangePerPage={onChangePerPage}
        headerTable={headerTable}
        loading={isLoading}
        dataProduct={dataRetailerCarrier}
        selectedItems={selectedItems}
        totalCount={dataRetailerCarrier.count}
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
