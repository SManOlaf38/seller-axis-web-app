import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
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
    <Dropdown
      mainMenu={<Image src="/three-dots.svg" width={20} height={20} alt="Picture of the author" />}
      className="w-[160px] dark:bg-gunmetal"
    >
      <div className="z-50 rounded-lg ">
        <Button onClick={onViewDetail(+row.id)}>
          <Image src="/detail.svg" width={13} height={13} alt="Picture of the author" />
          Detail
        </Button>
        <Button onClick={onDelete(+row.id)}>
          <Image src="/delete.svg" width={13} height={13} alt="Picture of the author" />
          Delete
        </Button>
      </div>
    </Dropdown>
  );
};
