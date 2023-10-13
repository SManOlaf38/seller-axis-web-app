import { useRef } from 'react';
import clsx from 'clsx';

import { Button } from '@/components/ui/Button';
import SortIcon from 'public/sortIcon.svg';

export default function SortButton({
  onSort,
  isAsc,
  isActive,
}: {
  dataField: string;
  isAsc: boolean;
  isActive: boolean;
  onSort: () => void;
}) {
  return (
    <Button
        onClick={onSort}
    >
      <SortIcon
        className={clsx(
          'h-2 w-2',
          {
            'fill-lightGray dark:fill-santaGrey': !isActive,
            'fill-dodgerBlue': isActive,
            '-rotate-180': isAsc,
          },
        )}
      />
    </Button>
  );
};
