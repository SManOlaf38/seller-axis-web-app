import Image from 'next/image';
import DeleteIcon from 'public/delete.svg';
import DetailIcon from 'public/detail.svg';

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
          <DetailIcon />
          Detail
        </Button>
        <Button onClick={onDelete(row.id as number)}>
          <DeleteIcon />
          Delete
        </Button>
      </div>
    </Dropdown>
  );
};
