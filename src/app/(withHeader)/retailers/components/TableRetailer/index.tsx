import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import { ListRetailerType } from '../../interface';
import { ChangeEvent, useMemo } from 'react';
import { RetailerItemActionMenu } from '../RetailerItemActionMenu';
import IconAction from 'public/three-dots.svg';
import DeleteIcon from 'public/delete.svg';

type TableRetailerProps = {
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
  loading?: boolean;
  retailers: ListRetailerType;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => Promise<void>;
  onChangePerPage: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export const TableRetailer = (props: TableRetailerProps) => {
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
    retailers,
    onViewDetailItem,
    onDeleteItem,
    onChangePerPage
  } = props;

  const renderBodyTable = useMemo(() => {
    return retailers?.results?.map((item) => ({
      id: item.id || '',
      name: item.name || '-',
      type: item.type || '-',
      merchant_id: item.merchant_id || '-',
      qbo_customer_ref_id: item.qbo_customer_ref_id || '-',
      default_carrier: item.default_carrier?.account_number || '-',
      default_warehouse: item.default_warehouse?.name || '-',
      default_gs1: item.default_gs1?.name || '-',
      created_at: dayjs(item.created_at).format('MM/DD/YYYY') || '',
      action: (
        <div
          className="flex items-center justify-center"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute">
            <RetailerItemActionMenu
              row={item}
              onViewDetailItem={onViewDetailItem}
              onDeleteItem={onDeleteItem}
            />
          </div>
        </div>
      )
    }));
  }, [onDeleteItem, onViewDetailItem, retailers?.results]);

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
      onClickItem={(id) => router.push(`/retailers/${id}`)}
      siblingCount={1}
      onPageChange={onPageChange}
      currentPage={page + 1}
      pageSize={rowsPerPage}
      selectAction={
        <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
          <div className="rounded-lg ">
            <Button>
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </Dropdown>
      }
    />
  );
};
