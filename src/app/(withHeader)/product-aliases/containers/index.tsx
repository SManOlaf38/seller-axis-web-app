'use client';

import { useRouter } from 'next/navigation';

import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { useCallback, useEffect } from 'react';
import { TableProductAlias } from '../components/TableProductAlias';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch/index';

export default function ProductAliasContainer() {
  const {
    state: { isLoading, dataProductAlias },
    dispatch
  } = useStore();
  const router = useRouter();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataProductAlias?.results as []
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/product-aliases/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteProductAliasRequest());
      await services.deleteProductAliasService(id);
      dispatch(actions.deleteProductAliasSuccess(id));
      handleGetProductAlias();
    } catch (error) {
      dispatch(actions.deleteProductAliasFailure(error));
    }
  };

  const handleGetProductAlias = useCallback(async () => {
    try {
      dispatch(actions.getProductAliasRequest());
      const dataProduct = await services.getProductAliasService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      dispatch(actions.getProductAliasSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getProductAliasFailure(error));
    }
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage]);

  useEffect(() => {
    handleGetProductAlias();
  }, [handleGetProductAlias]);

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'Product Alias'}
        onSubmit={() => router.push('/product-aliases/create')}
        addTitle="Add Product Alias"
      />

      <TableProductAlias
        headerTable={headerTable}
        onChangePerPage={onChangePerPage}
        loading={isLoading}
        dataProduct={dataProductAlias}
        selectedItems={selectedItems}
        totalCount={dataProductAlias.count}
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
