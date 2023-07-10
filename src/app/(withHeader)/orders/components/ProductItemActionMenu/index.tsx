import Image from 'next/image';

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
    <Dropdown
      mainMenu={<Image src="/three-dots.svg" width={20} height={20} alt="Picture of the author" />}
      className="w-[160px] dark:bg-gunmetal"
    >
      <div className="z-50 rounded-lg ">
        <Button onClick={onViewDetail(+row.id)}>
          <Image src="/detail.svg" width={13} height={13} alt="Picture of the author" />
          Detail
        </Button>
      </div>
    </Dropdown>
  );
};
