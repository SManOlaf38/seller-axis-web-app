'use client';

import { useRouter } from 'next/navigation';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { useCallback, useEffect } from 'react';
import { TableProductSeries } from '../components/TableProductSeries';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch/index';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

export default function ProductSeriesContainer() {
  const {
    state: { isLoading, dataProductSeries },
    dispatch
  } = useStore();
  const router = useRouter();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem, setSelectedItems } = useSelectTable({
    data: dataProductSeries?.results as []
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/product-series/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteProductSeriesRequest());
      await services.deleteProductSeriesService(id);
      dispatch(actions.deleteProductSeriesSuccess(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Products Series Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetProductSeries();
      setSelectedItems([]);
    } catch (error: any) {
      dispatch(actions.deleteProductSeriesFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Products Series Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetProductSeries = useCallback(async () => {
    try {
      dispatch(actions.getProductSeriesRequest());
      const dataProduct = await services.getProductSeriesService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      dispatch(actions.getProductSeriesSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getProductSeriesFailure(error));
    }
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage]);

  const handleDeleteBulkItem = async (ids: number[]) => {
    try {
      dispatch(actions.deleteBulkProductSeriesRequest());
      await services.deleteBulkProductSeriesService(ids);
      dispatch(actions.deleteBulkProductSeriesSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Bulk Product Series Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetProductSeries();
      setSelectedItems([]);
    } catch (error: any) {
      dispatch(actions.deleteBulkProductSeriesFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Bulk Product Series Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    handleGetProductSeries();
  }, [handleGetProductSeries]);

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'Product Series'}
        onSubmit={() => router.push('/product-series/create')}
        addTitle="Add"
      />

      <TableProductSeries
        onChangePerPage={onChangePerPage}
        headerTable={headerTable}
        loading={isLoading}
        dataProduct={dataProductSeries}
        selectedItems={selectedItems}
        totalCount={dataProductSeries.count}
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
