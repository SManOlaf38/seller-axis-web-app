import { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  startDate: string | null;
  setStartDate: Dispatch<SetStateAction<string | null>>;
  endDate: string | null;
  setEndDate: Dispatch<SetStateAction<string | null>>;
};

const DateRangePicker = (props: Props) => {
  const { startDate, setStartDate, endDate, setEndDate } = props;
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

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
      <button
        onClick={toggleDropdown}
        className="flex min-w-[310px] items-start rounded-2xl bg-neutralLight px-3 py-[7px] focus:border-blue-500 focus:outline-none dark:bg-gunmetal"
      >
        <p className="text-xs font-normal">
          {startDate && endDate
            ? `Last ${calculateDayCount()} days: From ${startDate} to ${endDate}`
            : 'Select Date ...'}
        </p>
      </button>
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
