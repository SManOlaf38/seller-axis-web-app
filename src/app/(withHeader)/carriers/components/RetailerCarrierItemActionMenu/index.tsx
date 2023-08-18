import IconAction from 'public/three-dots.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import DetailIcon from 'public/detail.svg';
import DeleteIcon from 'public/delete.svg';
import type { RetailerCarrier } from '../../interface';

export type ActionProps = {
  row: RetailerCarrier;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
};

export const RetailerCarrierItemActionMenu = ({
  row,
  onDeleteItem,
  onViewDetailItem
}: ActionProps) => {
  const onDelete = (value: number) => () => {
    onDeleteItem(value);
  };

  const onViewDetail = (value: number) => () => {
    onViewDetailItem(value);
  };

  return (
    <Dropdown mainMenu={<IconAction />} className="right-[55px] top-[-55px] w-24">
      <div className="z-50 rounded-lg ">
        <Button onClick={onViewDetail(+row.id)} startIcon={<DetailIcon />}>
          Detail
        </Button>
        <Button onClick={onDelete(+row.id)} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </div>
    </Dropdown>
  );
};
