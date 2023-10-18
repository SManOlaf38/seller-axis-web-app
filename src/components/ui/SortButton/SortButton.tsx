import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import SortIcon from 'public/sortIcon.svg';

export default function SortButton({
  dataField,
}: {
  dataField: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sort_by');
  const isAsc = sortBy && sortBy[0] !== '-';
  const isActive = isAsc ? sortBy === dataField : sortBy?.substring(1) === dataField;
  
  return (
    <Button
      onClick={() => {
        const params = new URLSearchParams(searchParams)
        params.set('sort_by', isActive ? `${isAsc ? '-' : ''}${dataField}` : dataField)
        router.push(`${pathname}?${params.toString()}`);
      }}
    >
      <SortIcon
        className={clsx(
          'h-2 w-2',
          {
            'fill-lightGray dark:fill-santaGrey': !isActive,
            'fill-dodgerBlue': isActive,
            '-rotate-180': isAsc && isActive,
          },
        )}
      />
    </Button>
  );
};
