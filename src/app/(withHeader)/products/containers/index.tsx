'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { SubBar } from '@/components/common/SubBar';
import { LAYOUTS } from '@/constants';
import useLayout from '@/hooks/useLayout';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { GridViewProduct } from '../components/GridView';
import { TableProduct } from '../components/TableProduct';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch';

export default function ProductContainer() {
  const {
    state: { isLoading, dataProduct },
    dispatch
  } = useStore();
  const router = useRouter();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { layout, handleChangeLayout } = useLayout();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataProduct?.results
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/products/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteProductRequest());
      await services.deleteProductService(id);
      dispatch(actions.deleteProductSuccess(id));
      handleGetProduct();
    } catch (error) {
      dispatch(actions.getProductFailure(error));
    }
  };

  const handleGetProduct = useCallback(async () => {
    try {
      dispatch(actions.getProductRequest());
      const dataProduct = await services.getProductService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      dispatch(actions.getProductSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getProductFailure(error));
    }
  }, [dispatch, page, debouncedSearchTerm, rowsPerPage]);

  const handleDeleteBulkItem = async (ids: number[]) => {
    try {
      dispatch(actions.deleteBulkProductRequest());
      await services.deleteBulkProductService(ids);
      dispatch(actions.deleteBulkProductSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Bulk Product Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetProduct();
    } catch (error: any) {
      dispatch(actions.deleteBulkProductFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Bulk Product Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    handleGetProduct();
  }, [handleGetProduct]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          search={search}
          onSearch={handleSearch}
          title={'Product'}
          onSubmit={() => router.push('/products/create')}
          addTitle="Add Product"
          typeLayout={layout}
          onChangeLayout={handleChangeLayout}
        />

        <div className="h-full">
          {layout === LAYOUTS.LIST ? (
            <TableProduct
              headerTable={headerTable}
              loading={isLoading}
              dataProduct={dataProduct}
              selectedItems={selectedItems}
              totalCount={dataProduct.count}
              page={page + 1}
              rowsPerPage={rowsPerPage}
              onSelectAll={onSelectAll}
              onSelectItem={onSelectItem}
              onPageChange={onPageChange}
              onViewDetailItem={handleViewDetailItem}
              onDeleteItem={handleDeleteItem}
              onChangePerPage={onChangePerPage}
              handleDeleteBulkItem={handleDeleteBulkItem}
            />
          ) : (
            <GridViewProduct
              onViewDetailItem={handleViewDetailItem}
              onDeleteItem={handleDeleteItem}
              loading={isLoading}
              dataProduct={dataProduct}
              totalCount={dataProduct.count}
              currentPage={page + 1}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </main>
  );
}
