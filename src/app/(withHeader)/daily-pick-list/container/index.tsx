'use client';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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

dayjs.extend(utc);
dayjs.extend(timezone);

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
    startDate: dayjs().tz('America/New_York').format('YYYY-MM-DD'),
    endDate: null
  });
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [activeButtonDate, setActiveButtonDate] = useState<string | null>(
    dayjs().tz('America/New_York').format('YYYY-MM-DD')
  );

  const handleGetDailyPickList = useCallback(async () => {
    try {
      DailyPickListDispatch(getDailyPickListRequest());
      const res = await getDailyPickListService({
        page,
        rowsPerPage,
        created_at: activeButtonDate || dayjs().tz('America/New_York').format()
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
      const start = dayjs.tz(dateRange.startDate, 'America/New_York');
      const end = dayjs.tz(dateRange.endDate, 'America/New_York');
      const today = dayjs().tz('America/New_York');

      const dayCount = Math.max(end.diff(start, 'day') + 1, 1);

      return Array.from({ length: dayCount }, (_, index) => {
        const date = start.add(index, 'day');
        const label = date.isSame(today, 'day') ? 'Today' : date.format('D');
        const month = date.isSame(today, 'day') ? '' : date.format('MMM').toUpperCase();

        return (
          <button
            key={date.toISOString()}
            className={clsx(
              'mr-4 flex flex-col items-center justify-center rounded px-[8px] py-[6px]',
              {
                'bg-buttonLight dark:bg-gunmetal': activeButtonDate === date.format('YYYY-MM-DD')
              }
            )}
            onClick={() => handleButtonClick(date.format('YYYY-MM-DD'))}
          >
            <p>{month}</p>
            <p className="text-lg font-bold">{label}</p>
          </button>
        );
      });
    } else {
      const label = 'Today';
      const month = '';
      const today = dayjs().tz('America/New_York');

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
    setActiveButtonDate(dayjs().tz('America/New_York').format('YYYY-MM-DD'));
    handleGetDailyPickList();
    !generateDateButtons();
    setDateRange({
      startDate: dayjs().tz('America/New_York').format('YYYY-MM-DD'),
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
