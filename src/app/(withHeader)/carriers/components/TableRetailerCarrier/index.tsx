import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

import IconAction from 'public/three-dots.svg';
import DeleteIcon from 'public/delete.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import type { ListRetailerCarrier } from '../../interface';
import { RetailerCarrierItemActionMenu } from '../RetailerCarrierItemActionMenu';

type TableRetailerCarrierProps = {
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
  dataProduct: ListRetailerCarrier;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => Promise<void>;
  onChangePerPage: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleDeleteBulkItem: (ids: number[]) => Promise<void>;
};

export const TableRetailerCarrier = (props: TableRetailerCarrierProps) => {
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
    client_id: row.client_id || '',
    client_secret: row.client_secret || '',
    service: row.service?.name || '',
    shipper: row.shipper?.name || '',
    created_at: dayjs(row.created_at).format('MM/DD/YYYY') || '',
    action: (
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-center"
      >
        <div>
          <RetailerCarrierItemActionMenu
            row={row}
            onViewDetailItem={onViewDetailItem}
            onDeleteItem={onDeleteItem}
          />
        </div>
      </div>
    )
  }));

  const handleDeleteBulkCarrier = (ids: number[]) => {
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
      onClickItem={(id) => router.push(`/carriers/${id}`)}
      selectAction={
        <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
          <div className="rounded-lg ">
            <Button onClick={() => handleDeleteBulkCarrier(selectedItems)}>
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </Dropdown>
      }
    />
  );
};
