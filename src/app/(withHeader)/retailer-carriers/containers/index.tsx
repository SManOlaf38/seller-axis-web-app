'use client';

import { useRouter } from 'next/navigation';

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

export default function RetailerCarrierContainer() {
  const {
    state: { isLoading, dataRetailerCarrier },
    dispatch
  } = useStore();
  const router = useRouter();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataRetailerCarrier?.results
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/retailer-carriers/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteRetailerCarrierRequest());
      await services.deleteRetailerCarrierService(id);
      dispatch(actions.deleteRetailerCarrierSuccess(id));
      handleGetRetailerCarrier();
    } catch (error) {
      dispatch(actions.deleteRetailerCarrierFailure(error));
    }
  };

  const handleGetRetailerCarrier = useCallback(async () => {
    try {
      dispatch(actions.getRetailerCarrierRequest());
      const dataProduct = await services.getRetailerCarrierService({
        search: debouncedSearchTerm,
        page
      });
      dispatch(actions.getRetailerCarrierSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getRetailerCarrierFailure(error));
    }
  }, [dispatch, page, debouncedSearchTerm]);

  useEffect(() => {
    handleGetRetailerCarrier();
  }, [handleGetRetailerCarrier]);

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'Retailer Carrier'}
        onSubmit={() => router.push('/retailer-carriers/create')}
        addTitle="Add Retailer Carrier"
      />

      <TableRetailerCarrier
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
      />
    </main>
  );
}
