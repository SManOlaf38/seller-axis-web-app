'use client';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

import DateRangePicker from '@/components/ui/DateRangePicker';
import { Button } from '@/components/ui/Button';
import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import { useStoreDailyPickList } from '../context';
import {
  getDailyPickListFailure,
  getDailyPickListRequest,
  getDailyPickListSuccess
} from '../context/action';
import { getDailyPickListService } from '../fetch';
import TableDailyPickList from '../components/TableDailyPickList';
import { convertDateToISO8601 } from '@/utils/utils';

export default function DailyPickListContainer() {
  const {
    state: { isLoading, dataDailyPickList },
    dispatch: DailyPickListDispatch
  } = useStoreDailyPickList();

  const groupNames = [
    ...(new Set(
      dataDailyPickList?.flatMap((item) => item?.group?.map((group) => group?.name))
    ) as never)
  ];

  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();

  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: null
  });
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [activeButtonDate, setActiveButtonDate] = useState<string | null>(
    new Date().toISOString().split('T')[0]
  );

  const handleGetDailyPickList = useCallback(async () => {
    try {
      DailyPickListDispatch(getDailyPickListRequest());
      const res = await getDailyPickListService({
        page,
        rowsPerPage,
        created_at:
          convertDateToISO8601(activeButtonDate as string) ||
          convertDateToISO8601(new Date().toISOString().split('T')[0])
      });
      DailyPickListDispatch(getDailyPickListSuccess(res));
    } catch (error: any) {
      DailyPickListDispatch(getDailyPickListFailure(error));
    }
  }, [DailyPickListDispatch, activeButtonDate, page, rowsPerPage]);

  const handleButtonClick = async (clickedDate: string) => {
    setActiveButtonDate(clickedDate);
  };

  const generateDateButtons = () => {
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate) as any;
      const end = new Date(dateRange.endDate) as any;
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
              'mr-4 flex flex-col items-center justify-center rounded px-[8px] py-[6px]',
              {
                'bg-buttonLight dark:bg-gunmetal':
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
          className="mr-4 flex flex-col items-center justify-center rounded bg-buttonLight px-[8px] py-[6px] dark:bg-gunmetal"
        >
          <p>{month}</p>
          <p className="text-lg font-bold">{label}</p>
        </button>
      );
    }
  };

  const handleClearDay = () => {
    setActiveButtonDate(new Date().toISOString().split('T')[0]);
    handleGetDailyPickList();
    !generateDateButtons();
    setDateRange({
      startDate: new Date().toISOString().split('T')[0],
      endDate: null
    });
  };

  useEffect(() => {
    handleGetDailyPickList();
  }, [handleGetDailyPickList]);

  useEffect(() => {
    dateRange.endDate && setDropdownVisible(false);
  }, [dateRange.endDate]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          title={'Daily Pick List'}
          isSearch={false}
          otherAction={
            <div className="flex items-center space-x-4">
              <DateRangePicker
                dateRange={dateRange}
                setDateRange={setDateRange}
                dropdownVisible={dropdownVisible}
                setDropdownVisible={setDropdownVisible}
              />
              <Button
                color="dark:bg-gunmetal bg-buttonLight"
                className="flex items-center py-2"
                onClick={handleClearDay}
                disabled={!dateRange.endDate}
              >
                Clear
              </Button>
            </div>
          }
        />
        {generateDateButtons() && <div className="flex flex-wrap">{generateDateButtons()}</div>}
        <div className="h-full">
          <TableDailyPickList
            onChangePerPage={onChangePerPage}
            dataDailyPickList={dataDailyPickList}
            groupNames={groupNames as []}
            isLoading={isLoading}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </main>
  );
}
