import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import type { Retailer } from '../../interface';
import IconAction from 'public/three-dots.svg';

export type ActionProps = {
  row: Retailer;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
};

export const RetailerItemActionMenu = ({ row, onDeleteItem, onViewDetailItem }: ActionProps) => {
  const onDelete = (value: number) => () => {
    onDeleteItem(value);
  };

  const onViewDetail = (value: number) => () => {
    onViewDetailItem(value);
  };

  return (
    <Dropdown mainMenu={<IconAction />} className="w-[160px] dark:bg-gunmetal">
      <div className="z-50 rounded-lg ">
        <Button onClick={onViewDetail(row.id as number)}>
          <Image src="/detail.svg" width={13} height={13} alt="Picture of the author" />
          Detail
        </Button>
        <Button onClick={onDelete(row.id as number)}>
          <Image src="/delete.svg" width={13} height={13} alt="Picture of the author" />
          Delete
        </Button>
      </div>
    </Dropdown>
  );
};
