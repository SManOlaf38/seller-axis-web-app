import IconAction from 'public/three-dots.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import DetailIcon from 'public/detail.svg';
import DeleteIcon from 'public/delete.svg';
import type { ProductAlias } from '../../interface';

export type ActionProps = {
  row: ProductAlias;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
};

export const ProductAliasItemActionMenu = ({
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
