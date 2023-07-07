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

export default function RetailerContainer() {
  const router = useRouter();
  const {
    state: { isLoading, dataRetailer },
    dispatch
  } = useStore();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataRetailer?.results
  });

  const [rowPerPageRetailer, setRowPerPageRetailer] = useState<number>(5);

  const handleViewDetailItem = (id: number) => {
    router.push(`/retailers/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteRetailerRequest());
      await services.deleteRetailerService(id);
      dispatch(actions.deleteRetailerSuccess(id));
      handleGetRetailer();
    } catch (error: any) {
      dispatch(actions.deleteRetailerFailure(error));
    }
  };

  const handleGetRetailer = useCallback(async () => {
    try {
      dispatch(actions.getRetailerRequest());
      const dataProduct = await services.getRetailerService({
        search: debouncedSearchTerm || '',
        page,
        rowsPerPage: rowPerPageRetailer + 5
      });
      dispatch(actions.getRetailerSuccess(dataProduct));
    } catch (error: any) {
      dispatch(actions.getRetailerFailure(error));
    }
  }, [dispatch, page, debouncedSearchTerm, rowPerPageRetailer]);

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
          title={'Retailer'}
          addTitle="Add Retailer"
        />

        <div className="h-full">
          <TableRetailer
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
          />
        </div>
      </div>
    </main>
  );
}
