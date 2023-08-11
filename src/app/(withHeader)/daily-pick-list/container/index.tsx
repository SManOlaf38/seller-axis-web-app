'use client';

import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';

import { TableDailyPickList } from '../components/TableDailyPickList';
import { dataDaily, headerTable } from '../constants';
import { useCallback, useEffect } from 'react';
import { useStoreDailyPickList } from '../context';
import { getDailyPickListRequest, getDailyPickListSuccess } from '../context/action';

export default function DailyPickListContainer() {
  const {
    state: { isLoading, dataDailyPickList },
    dispatch: DailyPickListDispatch
  } = useStoreDailyPickList();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataDaily
  });

  const handleGetDailyPickList = useCallback(async () => {}, []);

  useEffect(() => {
    handleGetDailyPickList();
  }, [handleGetDailyPickList]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar search={search} onSearch={handleSearch} title={'Daily Pick List'} />
        <div className="h-full">
          <TableDailyPickList
            headerTable={headerTable}
            dataDaily={dataDaily}
            selectedItems={selectedItems}
            totalCount={10}
            page={page}
            rowsPerPage={rowsPerPage}
            onSelectAll={onSelectAll}
            onSelectItem={onSelectItem}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </main>
  );
}
