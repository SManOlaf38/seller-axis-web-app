'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Table } from '@/components/ui/Table';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { SubBar } from '@/components/common/SubBar';
import useSearch from '@/hooks/useSearch';
import usePagination from '@/hooks/usePagination';
import useSelectTable from '@/hooks/useSelectTable';
import DownloadIcon from 'public/download.svg';
import IconAction from 'public/three-dots.svg';

import { useStoreDailyPickList } from '../context';
import {
  getDailyPickListFailure,
  getDailyPickListRequest,
  getDailyPickListSuccess
} from '../context/action';
import { getDailyPickListService } from '../fetch';
import { DailyPickList, Group, HeaderTable } from '../interfaces';
import { headerTable } from '../constants';

export default function DailyPickListContainer() {
  const {
    state: { isLoading, dataDailyPickList },
    dispatch: DailyPickListDispatch
  } = useStoreDailyPickList();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transformedData = [] as any;
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: transformedData
  });
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    if (!startDate || newEndDate >= startDate) {
      setEndDate(newEndDate);
    }
  };

  dataDailyPickList?.forEach((item: DailyPickList) => {
    const newItem: Record<string, string | number> = {
      Product_SKU: item?.product_sku || '-',
      Sub_Quantity: item?.quantity || '-',
      Available_Quantity: item?.available_quantity || '-'
    };
    item?.group?.forEach((groupItem: Group) => {
      newItem[`PK${groupItem?.name}`] = groupItem?.count || '--';
    });

    transformedData.push(newItem);
  });

  const renderBodyTable = useMemo(() => {
    return transformedData?.map((item: any) => ({
      Product_SKU: item?.Product_SKU || '-',
      PK1: item.PK1 || '--',
      PK6: item.PK6 || '--',
      PK8: item.PK8 || '--',
      PK12: item.PK12 || '--',
      PK13: item.PK13 || '--',
      PK32: item.PK32 || '--',
      Sub_Quantity: item.Sub_Quantity || '-',
      Available_Quantity: item.Available_Quantity || '-'
    }));
  }, [transformedData]);

  const itemSelected = useMemo(() => {
    return transformedData?.filter((item: DailyPickList, index: number) =>
      selectedItems?.includes(index)
    );
  }, [transformedData, selectedItems]);

  const handleGetDailyPickList = useCallback(async () => {
    try {
      DailyPickListDispatch(getDailyPickListRequest());
      const res = await getDailyPickListService();
      DailyPickListDispatch(getDailyPickListSuccess(res));
    } catch (error: any) {
      DailyPickListDispatch(getDailyPickListFailure(error));
    }
  }, [DailyPickListDispatch]);

  const handlePrintItemSelected = () => {
    const doc = new jsPDF();
    const printHeader = headerTable?.map((item: HeaderTable) => item.label);
    const body = itemSelected?.map((item: DailyPickList) => Object.values(item));
    autoTable(doc, {
      theme: 'grid',
      head: [printHeader],
      body: body
    });
    doc.save('daily_pick_list.pdf');
  };

  useEffect(() => {
    handleGetDailyPickList();
  }, [handleGetDailyPickList]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar search={search} onSearch={handleSearch} title={'Daily Pick List'} />
        <div className="flex space-x-4">
          <div>
            <p>From</p>
            <input
              type="date"
              value={startDate || ''}
              onChange={handleStartDateChange}
              className="flex items-center justify-center rounded-md border-none bg-neutralLight px-2 py-[6px] text-[14px] dark:bg-gunmetal"
            />
          </div>

          <div>
            <p>To</p>
            <input
              type="date"
              value={endDate || ''}
              onChange={handleEndDateChange}
              min={startDate || undefined}
              className="flex items-center justify-center rounded-md border-none bg-neutralLight px-2 py-[6px] text-[14px] dark:bg-gunmetal"
            />
          </div>
        </div>
        <div className="h-full">
          <Table
            columns={headerTable}
            loading={isLoading}
            rows={renderBodyTable}
            isPagination
            isSelect={true}
            selectedItems={selectedItems}
            selectAllTable={onSelectAll}
            selectItemTable={onSelectItem}
            // totalCount={dataBox?.count}
            siblingCount={1}
            onPageChange={onPageChange}
            currentPage={page + 1}
            pageSize={rowsPerPage}
            selectAction={
              <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
                <div className="rounded-lg">
                  <Button onClick={handlePrintItemSelected}>
                    <DownloadIcon />
                    <span className="items-start text-lightPrimary dark:text-santaGrey">
                      Download
                    </span>
                  </Button>
                </div>
              </Dropdown>
            }
          />
        </div>
      </div>
    </main>
  );
}
