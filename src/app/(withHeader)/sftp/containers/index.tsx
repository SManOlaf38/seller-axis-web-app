'use client';

import { useRouter } from 'next/navigation';

import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { useCallback, useEffect } from 'react';
import { TableSFTP } from '../components/TableSFTP';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch/index';

export default function SFTPContainer() {
  const {
    state: { isLoading, dataSFTP },
    dispatch
  } = useStore();
  const router = useRouter();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataSFTP?.results
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/sftp/${id}`);
  };

  const handleDownloadOrder = async (id: number) => {
    try {
      dispatch(actions.downloadOrderRequest());
      await services.downloadOrderService(id);
      dispatch(actions.downloadOrderSuccess(id));
      handleGetSFTP();
    } catch (error) {
      dispatch(actions.downloadOrderFailure(error));
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteSFTPRequest());
      await services.deleteSFTPService(id);
      dispatch(actions.deleteSFTPSuccess(id));
      handleGetSFTP();
    } catch (error) {
      dispatch(actions.deleteSFTPFailure(error));
    }
  };

  const handleGetSFTP = useCallback(async () => {
    try {
      dispatch(actions.getSFTPRequest());
      const dataProduct = await services.getSFTPService({
        search: debouncedSearchTerm,
        page
      });
      dispatch(actions.getSFTPSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getSFTPFailure(error));
    }
  }, [dispatch, page, debouncedSearchTerm]);

  useEffect(() => {
    handleGetSFTP();
  }, [handleGetSFTP]);

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'SFTP'}
        onSubmit={() => router.push('/sftp/create')}
        addTitle="Add SFTP"
      />

      <TableSFTP
        headerTable={headerTable}
        loading={isLoading}
        dataProduct={dataSFTP}
        selectedItems={selectedItems}
        totalCount={dataSFTP.count}
        page={page}
        rowsPerPage={rowsPerPage}
        onSelectAll={onSelectAll}
        onSelectItem={onSelectItem}
        onPageChange={onPageChange}
        onViewDetailItem={handleViewDetailItem}
        onDeleteItem={handleDeleteItem}
        onDownloadOrder={handleDownloadOrder}
      />
    </main>
  );
}
