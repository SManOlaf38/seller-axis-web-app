import { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

import IconAction from 'public/three-dots.svg';
import DeleteIcon from 'public/delete.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import type { ListRetailerWarehouse } from '../../interface';
import { RetailerWarehouseItemActionMenu } from '../RetailerWarehouseItemActionMenu';

type TableRetailerWarehouseProps = {
  headerTable: {
    id: string;
    label: string;
  }[];
  selectedItems: number[];
  onSelectAll: () => void;
  onSelectItem: (id: number) => void;
  totalCount: number;
  onPageChange: (value: string | number) => void;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  dataProduct: ListRetailerWarehouse;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => Promise<void>;
  onChangePerPage: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleDeleteBulkItem: (ids: number[]) => Promise<void>;
};

export const TableRetailerWarehouse = (props: TableRetailerWarehouseProps) => {
  const router = useRouter();

  const {
    headerTable,
    selectedItems,
    onSelectAll,
    onSelectItem,
    totalCount,
    onPageChange,
    page,
    rowsPerPage,
    loading,
    dataProduct,
    onViewDetailItem,
    onDeleteItem,
    onChangePerPage,
    handleDeleteBulkItem
  } = props;

  const renderBodyTable = dataProduct.results?.map((row) => ({
    id: row.id || '',
    name: row.name || '-',
    address_1: row.address_1 || '-',
    description: row.description || '-',
    city: row.city || '-',
    state: row.state || '-',
    postal_code: row.postal_code || '-',
    country: row.country || '-',
    phone: row.phone || '-',
    action: (
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-center"
      >
        <div className="absolute">
          <RetailerWarehouseItemActionMenu
            row={row}
            onViewDetailItem={onViewDetailItem}
            onDeleteItem={onDeleteItem}
          />
        </div>
      </div>
    )
  }));

  const handleDeleteBulkWarehouse = (ids: number[]) => {
    handleDeleteBulkItem && handleDeleteBulkItem(ids);
  };

  return (
    <Table
      onChangePerPage={onChangePerPage}
      columns={headerTable}
      loading={loading}
      rows={renderBodyTable}
      isPagination
      isSelect={true}
      selectedItems={selectedItems}
      selectAllTable={onSelectAll}
      selectItemTable={onSelectItem}
      totalCount={totalCount}
      siblingCount={1}
      onPageChange={onPageChange}
      currentPage={page + 1}
      pageSize={rowsPerPage}
      onClickItem={(id) => router.push(`/warehouse/${id}`)}
      selectAction={
        <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
          <div className="rounded-lg ">
            <Button onClick={() => handleDeleteBulkWarehouse(selectedItems)}>
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </Dropdown>
      }
    />
  );
};
