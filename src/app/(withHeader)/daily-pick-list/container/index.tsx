'use client';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const { page, rowsPerPage, onPageChange } = usePagination();

  const [startDate, setStartDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [activeButtonDate, setActiveButtonDate] = useState(null);

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
    handleGetDailyPickList();
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
          <TableDailyPickList
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
