import { Dispatch, SetStateAction, useState } from 'react';

import IconArrowDown from 'public/down.svg';
import IconRight from 'public/right.svg';

type Props = {
  startDate: string | null;
  setStartDate: Dispatch<SetStateAction<string | null>>;
  endDate: string | null;
  setEndDate: Dispatch<SetStateAction<string | null>>;
  dropdownVisible: boolean;
  setDropdownVisible: Dispatch<SetStateAction<boolean>>;
};

const DateRangePicker = (props: Props) => {
  const { startDate, setStartDate, endDate, setEndDate, dropdownVisible, setDropdownVisible } =
    props;

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const calculateDayCount = () => {
    if (startDate && endDate) {
      const start = new Date(startDate) as never;
      const end = new Date(endDate) as never;
      const dayCount = (end - start) / (1000 * 60 * 60 * 24) + 1;
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
          {startDate && endDate ? (
            <>
              <p className="font-semibold">{`Last ${calculateDayCount()} days: `}</p>
              <p className="pl-1 font-normal">{`From ${startDate} to ${endDate}`}</p>
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
              value={startDate || ''}
              onChange={handleStartDateChange}
              className="flex items-center justify-center rounded-md border-none bg-neutralLight px-2 py-[6px] text-[14px] dark:bg-gunmetal"
            />
          </div>
          <div>
            <p className="mb-2 text-xs text-lightPrimary dark:text-santaGrey">End Date</p>
            <input
              type="date"
              value={endDate || ''}
              onChange={handleEndDateChange}
              min={startDate || undefined}
              className="flex items-center justify-center rounded-md border-none bg-neutralLight px-2 py-[6px] text-[14px] dark:bg-gunmetal"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
