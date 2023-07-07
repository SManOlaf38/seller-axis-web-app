'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

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
  const { page, rowsPerPage, onPageChange } = usePagination();
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
        page
      });
      dispatch(actions.getProductSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getProductFailure(error));
    }
  }, [dispatch, page, debouncedSearchTerm]);

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
              page={page}
              rowsPerPage={rowsPerPage}
              onSelectAll={onSelectAll}
              onSelectItem={onSelectItem}
              onPageChange={onPageChange}
              onViewDetailItem={handleViewDetailItem}
              onDeleteItem={handleDeleteItem}
            />
          ) : (
            <GridViewProduct
              onViewDetailItem={handleViewDetailItem}
              onDeleteItem={handleDeleteItem}
              loading={isLoading}
              dataProduct={dataProduct}
              totalCount={dataProduct.count}
              currentPage={page}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </main>
  );
}
