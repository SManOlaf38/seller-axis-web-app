'use client';
import { useState } from 'react';

import IconPlus from 'public/plus-icon.svg';
import IconRefresh from 'public/refresh.svg';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import usePagination from '@/hooks/usePagination';
import useSelectTable from '@/hooks/useSelectTable';

import { InviteMember } from '../ModalPackage';
import TablePackage from './components/TablePackage';

export const headerTable = [
  {
    id: 'action',
    label: 'Action'
  },
  {
    id: 'box_name',
    label: 'Box Name'
  },
  {
    id: 'items',
    label: 'Items'
  },
  {
    id: 'qty',
    label: 'Quantity'
  }
];

export type PackageDivide = {
  id: number | string;
  box_name: string;
  products?: any;
};

const Package = () => {
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: []
  });

  const [isOpenPackage, setIsOpenPackage] = useState(false);
  const [dataPackage, setDataPackage] = useState<PackageDivide[]>([]);

  const handleTogglePackage = () => {
    setIsOpenPackage((isOpenPackage) => !isOpenPackage);
  };

  const handleAddDataPackage = (data: PackageDivide) => {
    setDataPackage([...dataPackage, data]);
  };

  return (
    <CardToggle title="Package & Shipment Detail">
      <div className="flex justify-end gap-2">
        <Button className="bg-gey100 dark:bg-gunmetal" startIcon={<IconRefresh />}>
          Reset
        </Button>

        <Button onClick={handleTogglePackage} className="bg-primary500" startIcon={<IconPlus />}>
          Add
        </Button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <TablePackage
          columns={headerTable}
          loading={false}
          totalCount={0}
          siblingCount={1}
          currentPage={page + 1}
          pageSize={rowsPerPage}
          dataPackage={dataPackage as PackageDivide[]}
          selectItemTable={onSelectItem}
          onPageChange={onPageChange}
        />
        <div className="w-[48%]">
          <span>Shipment Detail</span>
        </div>
      </div>
      <InviteMember
        open={isOpenPackage}
        onAddDataPackage={handleAddDataPackage}
        onModalMenuToggle={handleTogglePackage}
      />
    </CardToggle>
  );
};

export default Package;
