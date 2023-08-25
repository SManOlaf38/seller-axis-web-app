import IconAction from 'public/three-dots.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import DetailIcon from 'public/detail.svg';
import DeleteIcon from 'public/delete.svg';
import type { Product } from '../../interface';

export type ActionProps = {
  row: Product;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
};

export const ProductItemActionMenu = ({ row, onDeleteItem, onViewDetailItem }: ActionProps) => {
  const onDelete = (value: number) => () => {
    onDeleteItem(value);
  };

  const onViewDetail = (value: number) => () => {
    onViewDetailItem(value);
  };

  return (
    <Dropdown
      classButton="justify-center"
      mainMenu={<IconAction />}
      className="fixed right-[35px] top-[-50px] w-24"
    >
      <div className="z-50 rounded-lg ">
        <Button onClick={onViewDetail(+row.id)}>
          <DetailIcon />
          Detail
        </Button>
        <Button onClick={onDelete(+row.id)}>
          <DeleteIcon />
          Delete
        </Button>
      </div>
    </Dropdown>
  );
};
