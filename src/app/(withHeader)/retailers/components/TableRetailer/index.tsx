import dayjs from 'dayjs';
import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import { ListRetailerType } from '../../interface';
import { useMemo } from 'react';
import { RetailerItemActionMenu } from '../RetailerItemActionMenu';
import IconAction from 'public/three-dots.svg';

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
};

export const TableRetailer = (props: TableRetailerProps) => {
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
    onDeleteItem
  } = props;

  const renderBodyTable = useMemo(() => {
    return retailers?.results?.map((item) => ({
      id: item.id || '',
      name: item.name || '',
      type: item.type || '',
      created_at: dayjs(item.created_at).format('YYYY-MM-DD') || '',
      action: (
        <div className="flex items-center justify-center">
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
      currentPage={page}
      pageSize={rowsPerPage}
      selectAction={
        <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
          <div className="rounded-lg ">
            <Button>
              <Image src="/delete.svg" width={13} height={13} alt="Picture of the author" />
              Delete
            </Button>
          </div>
        </Dropdown>
      }
    />
  );
};
