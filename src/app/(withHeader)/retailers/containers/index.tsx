'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch';
import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { headerTable } from '../constants';
import { TableRetailer } from '../components/TableRetailer';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';

export default function RetailerContainer() {
  const router = useRouter();
  const {
    state: { isLoading, dataRetailer },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { search, debouncedSearchTerm, handleSearch } = useSearch('retailer');
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem, setSelectedItems } = useSelectTable({
    data: dataRetailer?.results
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/retailers/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteRetailerRequest());
      await services.deleteRetailerService(id);
      dispatch(actions.deleteRetailerSuccess(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Retailer Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetRetailer();
      setSelectedItems([]);
    } catch (error: any) {
      dispatch(actions.deleteRetailerFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Retailer Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleDeleteBulkItem = async (ids: number[]) => {
    try {
      dispatch(actions.deleteBulkRetailersRequest());
      await services.deleteBulkRetailersService(ids);
      dispatch(actions.deleteBulkRetailersSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Bulk Retailer Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetRetailer();
      setSelectedItems([]);
    } catch (error: any) {
      dispatch(actions.deleteBulkRetailersFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Bulk Retailer Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetRetailer = useCallback(async () => {
    try {
      dispatch(actions.getRetailerRequest());
      const dataProduct = await services.getRetailerService({
        search: debouncedSearchTerm || '',
        page,
        rowsPerPage
      });
      dispatch(actions.getRetailerSuccess(dataProduct));
    } catch (error: any) {
      dispatch(actions.getRetailerFailure(error));
    }
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage]);

  useEffect(() => {
    handleGetRetailer();
  }, [handleGetRetailer]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          search={search}
          onSearch={handleSearch}
          onSubmit={() => router.push('/retailers/create')}
          title={'Retailers'}
          addTitle="Add Retailer"
        />

        <div className="h-full">
          <TableRetailer
            onChangePerPage={onChangePerPage}
            loading={isLoading}
            headerTable={headerTable}
            retailers={dataRetailer}
            selectedItems={selectedItems}
            totalCount={dataRetailer.count}
            page={page}
            rowsPerPage={rowsPerPage}
            onSelectAll={onSelectAll}
            onSelectItem={onSelectItem}
            onPageChange={onPageChange}
            onViewDetailItem={handleViewDetailItem}
            onDeleteItem={handleDeleteItem}
            handleDeleteBulkItem={handleDeleteBulkItem}
          />
        </div>
      </div>
    </main>
  );
}
