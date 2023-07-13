import IconAction from 'public/three-dots.svg';
import IconDetail from 'public/detail.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import type { Order } from '../../interface';

export type ActionProps = {
  row: Order;
  onViewDetailItem: (id: number) => void;
};

export const ProductItemActionMenu = ({ row, onViewDetailItem }: ActionProps) => {
  const onViewDetail = (value: number) => () => {
    onViewDetailItem(value);
  };

  return (
    <Dropdown mainMenu={<IconAction />} className="w-[160px] dark:bg-gunmetal">
      <div className="z-50 rounded-lg ">
        <Button onClick={onViewDetail(+row.id)}>
          <IconDetail />
          Detail
        </Button>
      </div>
    </Dropdown>
  );
};
