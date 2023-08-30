import { Dispatch, SetStateAction, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import IconArrowDown from 'public/down.svg';
import IconRight from 'public/right.svg';

dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  dateRange: {
    startDate: string;
    endDate: null;
  };
  setDateRange: Dispatch<
    SetStateAction<{
      startDate: string;
      endDate: null;
    }>
  >;
  dropdownVisible: boolean;
  setDropdownVisible: Dispatch<SetStateAction<boolean>>;
};

const DateRangePicker = (props: Props) => {
  const { dateRange, setDateRange, dropdownVisible, setDropdownVisible } = props;

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const { value } = event.target;
    setDateRange((prevDateRange) => ({
      ...prevDateRange,
      [type]: value
    }));
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const calculateDayCount = () => {
    if (dateRange.startDate && dateRange.endDate) {
      const start = dayjs.tz(dateRange.startDate, 'America/New_York');
      const end = dayjs.tz(dateRange.endDate, 'America/New_York');
      const dayCount = end.diff(start, 'day') + 1;
      return dayCount;
    }
    return 0;
  };

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className="flex min-w-[310px] cursor-pointer items-center justify-between rounded-2xl bg-neutralLight px-3 py-[7px] focus:border-blue-500 focus:outline-none dark:bg-gunmetal"
      >
        <div className="flex text-xs">
          {dateRange.startDate && dateRange.endDate ? (
            <>
              <p className="font-semibold">{`Last ${calculateDayCount()} days: `}</p>
              <p className="pl-1 font-normal">{`From ${dayjs
                .tz(dateRange.startDate, 'America/New_York')
                .format('MM/DD/YYYY')} to ${dayjs
                .tz(dateRange.endDate, 'America/New_York')
                .format('MM/DD/YYYY')}`}</p>
            </>
          ) : (
            'Date Range Picker ...'
          )}
        </div>
        {dropdownVisible ? <IconArrowDown /> : <IconRight />}
      </div>
      {dropdownVisible && (
        <div className="absolute left-0 mt-2 flex w-full origin-top-right items-center justify-between rounded-2xl bg-paperLight px-3 py-[7px] shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen">
          <div>
            <p className="mb-2 text-xs text-lightPrimary dark:text-santaGrey">Start Date</p>
            <input
              type="date"
              value={dateRange.startDate || ''}
              onChange={(event) => handleDateChange(event, 'startDate')}
              className="flex items-center justify-center rounded-md border-none bg-neutralLight px-2 py-[6px] text-[14px] dark:bg-gunmetal"
            />
          </div>
          <div>
            <p className="mb-2 text-xs text-lightPrimary dark:text-santaGrey">End Date</p>
            <input
              type="date"
              value={dateRange.endDate || ''}
              onChange={(event) => handleDateChange(event, 'endDate')}
              min={dateRange.startDate || undefined}
              className="flex items-center justify-center rounded-md border-none bg-neutralLight px-2 py-[6px] text-[14px] dark:bg-gunmetal"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
