'use client';
import { useState } from 'react';

import { InviteMember } from '../ModalPackage';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';
import { Dropdown } from '@/components/ui/Dropdown';
import IconPlus from 'public/plus-icon.svg';
import DetailIcon from 'public/detail.svg';
import DeleteIcon from 'public/delete.svg';
import ActionIcon from 'public/three-dots.svg';
import IconRefresh from 'public/refresh.svg';

export const headerTablePackageRule = [
  {
    id: 'sku',
    label: 'SKU'
  },
  {
    id: 'quantity',
    label: 'Quantity'
  },
  {
    id: 'height',
    label: 'Height'
  },
  {
    id: 'length',
    label: 'Length'
  },
  {
    id: 'width',
    label: 'Width'
  },
  {
    id: 'dimension_unit',
    label: 'Dimension unit'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export type PackageDivide = {
  sku: {
    label: string;
    value: number;
  } | null;
  quantity: number;
  height: number;
  length: number;
  weight: number;
  width: number;
  dimension_unit: string;
};

const Package = () => {
  const [isOpenPackage, setIsOpenPackage] = useState(false);
  const [dataPackage, setDataPackage] = useState<PackageDivide[]>([]);

  const handleTogglePackage = () => {
    setIsOpenPackage((isOpenPackage) => !isOpenPackage);
  };

  const handleAddDataPackage = (data: PackageDivide) => {
    setDataPackage([...dataPackage, data]);
  };

  const renderBodyTable = dataPackage?.map((row: any) => ({
    sku: row.sku.label || '-',
    quantity: row.quantity || '-',
    height: row.height || '-',
    length: row.length || '-',
    width: row.width || '-',
    dimension_unit: row.dimension_unit || '',
    action: (
      <div className="flex items-center justify-center">
        <div className="absolute">
          <Dropdown mainMenu={<ActionIcon />} className="w-24">
            <div className="z-50 rounded-lg ">
              <Button startIcon={<DetailIcon />}>Detail</Button>
              <Button startIcon={<DeleteIcon />}>Delete</Button>
            </div>
          </Dropdown>
        </div>
      </div>
    )
  }));
  return (
    <CardToggle title="Pack">
      <div className="flex justify-end gap-2">
        <Button className="bg-gey100 dark:bg-gunmetal" startIcon={<IconRefresh />}>
          Reset
        </Button>

        <Button onClick={handleTogglePackage} className="bg-primary500" startIcon={<IconPlus />}>
          Add
        </Button>
      </div>
      <div className="mt-4">
        <Table
          columns={headerTablePackageRule}
          loading={false}
          rows={renderBodyTable}
          totalCount={0}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={10}
          pageSize={10}
          isBorder={false}
        />
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
