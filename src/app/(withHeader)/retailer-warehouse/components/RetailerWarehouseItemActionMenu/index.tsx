import IconAction from 'public/three-dots.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import DeleteIcon from 'public/delete.svg';
import DetailIcon from 'public/detail.svg';
import type { RetailerWarehouse } from '../../interface';

export type ActionProps = {
  row: RetailerWarehouse;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
};

export const RetailerWarehouseItemActionMenu = ({
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
    <Dropdown mainMenu={<IconAction />} className="w-24">
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
