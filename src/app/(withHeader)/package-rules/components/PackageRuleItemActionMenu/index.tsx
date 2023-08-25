import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import IconAction from 'public/three-dots.svg';
import { PackageRule } from '../../interface';
import IconDelete from 'public/delete.svg';
import IconDetail from 'public/detail.svg';

export type ActionProps = {
  row: PackageRule;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
};

export const PackageRuleItemActionMenu = ({ row, onDeleteItem, onViewDetailItem }: ActionProps) => {
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
          <IconDetail />
          <span className="items-start text-lightPrimary  dark:text-santaGrey">Detail</span>
        </Button>
        <Button onClick={onDelete(row.id as number)}>
          <IconDelete />
          <span className="items-start text-lightPrimary  dark:text-santaGrey">Delete</span>
        </Button>
      </div>
    </Dropdown>
  );
};
