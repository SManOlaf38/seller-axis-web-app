'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Table } from '@/components/ui/Table';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { SubBar } from '@/components/common/SubBar';
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
import { DailyPickList, HeaderTable, ItemTransformed } from '../interfaces';
import { headerTable } from '../constants';
import DateRangePicker from '@/components/ui/DateRangePicker';

export default function DailyPickListContainer() {
  const {
    state: { isLoading, dataDailyPickList },
    dispatch: DailyPickListDispatch
  } = useStoreDailyPickList();

  const transformedData = useMemo(() => {
    const transformedDataArray = [] as any;
    dataDailyPickList?.forEach((item) => {
      const newItem: Record<string, string | number> = {
        id: item?.id,
        Product_SKU: item?.product_sku || '-',
        Sub_Quantity: item?.quantity || '-',
        Available_Quantity: item?.available_quantity || '-'
      };

      item?.group?.forEach((groupItem) => {
        newItem[`PK${groupItem?.name}`] = groupItem?.count || '--';
      });
      transformedDataArray.push(newItem);
    });

    return transformedDataArray;
  }, [dataDailyPickList]);

  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: transformedData
  });
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(false);

  const renderBodyTable = useMemo(() => {
    return transformedData?.map((item: ItemTransformed) => ({
      id: item?.id,
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
    return transformedData?.filter((item: DailyPickList) => selectedItems?.includes(item?.id));
  }, [transformedData, selectedItems]);

  const handleGetDailyPickList = useCallback(async () => {
    try {
      DailyPickListDispatch(getDailyPickListRequest());
      const res = await getDailyPickListService({
        page,
        rowsPerPage
      });
      DailyPickListDispatch(getDailyPickListSuccess(res));
    } catch (error: any) {
      DailyPickListDispatch(getDailyPickListFailure(error));
    }
  }, [DailyPickListDispatch, page, rowsPerPage]);

  const handlePrintItemSelected = () => {
    const doc = new jsPDF();
    const printHeader = headerTable?.map((item: HeaderTable) => item.label);
    const body = itemSelected?.map((item: ItemTransformed) => [
      item.Product_SKU,
      item.PK1,
      item.PK6,
      item.PK8,
      item.PK12,
      item.PK13,
      item.PK32,
      item.Sub_Quantity,
      item.Available_Quantity
    ]);

    autoTable(doc, {
      theme: 'grid',
      head: [printHeader],
      body: body
    });
    doc.save('daily_pick_list.pdf');
  };

  const generateDateButtons = () => {
    const buttons = [];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        let label = '';

        if (date.toDateString() === today.toDateString()) {
          label = 'Today';
        } else {
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
          label = `${day} ${month}`;
        }

        buttons.push(
          <button key={date.toISOString()} className="m-1 rounded bg-blue-500 px-3 py-2 text-white">
            {label}
          </button>
        );
      }
    }
    return buttons;
  };

  const handleFilterDay = () => {
    setShowButtons(true);
  };

  useEffect(() => {
    handleGetDailyPickList();
  }, [handleGetDailyPickList]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          title={'Daily Pick List'}
          isSearch={false}
          otherAction={
            <div className="flex items-center space-x-4">
              <DateRangePicker
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
              <Button
                color="bg-primary500"
                className="flex items-center py-2"
                onClick={handleFilterDay}
              >
                <span className="text-white">Submit</span>
              </Button>
            </div>
          }
        />

        {showButtons && <div className="mt-2 flex flex-wrap">{generateDateButtons()}</div>}
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
            totalCount={transformedData?.length}
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
