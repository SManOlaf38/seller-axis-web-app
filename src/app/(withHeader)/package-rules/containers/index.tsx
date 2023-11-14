'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch';
import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { TablePackageRule } from '../components/TablePackageRule';
import { headerTable } from '../constants';

export default function PackageRuleContainer() {
  const router = useRouter();
  const {
    state: { isLoading, dataPackageRule },
    dispatch
  } = useStore();

  const { search, debouncedSearchTerm, handleSearch } = useSearch('package-rule');
  const { page, rowsPerPage, onPageChange, setCurrentPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataPackageRule?.results
  });

  const handleViewDetailItem = (id: number) => {
    router.push(`/package-rules/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deletePackageRuleRequest());
      await services.deletePackageRuleService(id);
      dispatch(actions.deletePackageRuleSuccess(id));
      handleGetPackageRule();
    } catch (error: any) {
      dispatch(actions.deletePackageRuleFailure(error));
    }
  };

  const handleGetPackageRule = useCallback(async () => {
    try {
      dispatch(actions.getPackageRuleRequest());
      const dataPackageRule = await services.getPackageRuleService({
        search: debouncedSearchTerm || '',
        page,
        rowsPerPage
      });
      dispatch(actions.getPackageRuleSuccess(dataPackageRule));
    } catch (error: any) {
      dispatch(actions.getPackageRuleFailure(error));
    }
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage]);

  useEffect(() => {
    handleGetPackageRule();
  }, [handleGetPackageRule]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          setCurrentPage={setCurrentPage}
          search={search}
          onSearch={handleSearch}
          onSubmit={() => router.push('/package-rules/create')}
          title={'Package Rule'}
          addTitle="Add Package Rule"
        />

        <div className="h-full">
          <TablePackageRule
            loading={isLoading}
            headerTable={headerTable}
            packageRules={dataPackageRule}
            selectedItems={selectedItems}
            totalCount={dataPackageRule?.count}
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
