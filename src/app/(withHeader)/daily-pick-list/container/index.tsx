'use client';
import clsx from 'clsx';
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
  const [startDate, setStartDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [activeButtonDate, setActiveButtonDate] = useState(null);

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
        rowsPerPage,
        created_at: new Date().toISOString().split('T')[0]
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

  const handleButtonClick = async (clickedDate: any) => {
    setActiveButtonDate(clickedDate);
    try {
      DailyPickListDispatch(getDailyPickListRequest());
      const res = await getDailyPickListService({
        page,
        rowsPerPage,
        created_at: clickedDate
      });
      DailyPickListDispatch(getDailyPickListSuccess(res));
    } catch (error: any) {
      DailyPickListDispatch(getDailyPickListFailure(error));
    }
  };

  const generateDateButtons = () => {
    if (startDate && endDate) {
      const start = new Date(startDate) as any;
      const end = new Date(endDate) as any;
      const today = new Date();

      return Array.from({ length: (end - start) / (24 * 60 * 60 * 1000) + 1 }, (_, index) => {
        const date = new Date(start.getTime() + index * 24 * 60 * 60 * 1000);
        const label =
          date.toDateString() === today.toDateString() ? 'Today' : date.getDate().toString();
        const month =
          date.toDateString() === today.toDateString()
            ? ''
            : date.toLocaleString('default', { month: 'short' }).toUpperCase();

        return (
          <button
            key={date.toISOString()}
            className={clsx(
              'mr-4 flex flex-col items-center justify-center rounded bg-transparent px-[8px] py-[6px] text-white',
              {
                'bg-neutralLight dark:bg-gunmetal':
                  activeButtonDate === date.toISOString().split('T')[0]
              }
            )}
            onClick={() => handleButtonClick(date.toISOString().split('T')[0])}
          >
            <p>{month}</p>
            <p className="text-lg font-bold">{label}</p>
          </button>
        );
      });
    } else {
      const label = 'Today';
      const month = '';
      const today = new Date();

      return (
        <button
          key={today.toISOString()}
          className="mr-4 flex flex-col items-center justify-center rounded bg-neutralLight px-[8px] py-[6px] text-white dark:bg-gunmetal"
        >
          <p>{month}</p>
          <p className="text-lg font-bold">{label}</p>
        </button>
      );
    }
  };

  const handleClearDay = () => {
    !generateDateButtons();
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(null);
  };

  useEffect(() => {
    handleGetDailyPickList();
  }, [handleGetDailyPickList]);

  useEffect(() => {
    endDate && setDropdownVisible(false);
  }, [endDate]);

  useEffect(() => {
    if (startDate === new Date().toISOString().split('T')[0]) {
      setActiveButtonDate(new Date().toISOString().split('T')[0] as never);
    }
  }, [startDate]);

  console.log('generateDateButtons()', generateDateButtons());

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
                dropdownVisible={dropdownVisible}
                setDropdownVisible={setDropdownVisible}
              />
              <Button
                color="bg-primary500"
                className="flex items-center py-2"
                onClick={handleClearDay}
              >
                <span className="text-white">Clear</span>
              </Button>
            </div>
          }
        />
        {generateDateButtons() && <div className="flex flex-wrap">{generateDateButtons()}</div>}
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
