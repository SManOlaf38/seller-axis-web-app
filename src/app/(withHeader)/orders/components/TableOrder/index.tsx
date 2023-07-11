import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import type { ListOrder } from '../../interface';
import { ProductItemActionMenu } from '../ProductItemActionMenu';

type TableOrderProps = {
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
  dataOrder: ListOrder;
  onViewDetailItem: (id: number) => void;
};

export const TableOrder = (props: TableOrderProps) => {
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
    dataOrder,
    onViewDetailItem
  } = props;

  const renderBodyTable = dataOrder.results?.map((row) => ({
    id: row?.id || '',
    po_number: row?.po_number || '',
    customer: row?.customer?.name || '',
    cust_order_number: row?.cust_order_number || '',
    order_date: dayjs(row?.order_date).format('YYYY-MM-DD') || '',
    action: (
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-center"
      >
        <div className="absolute">
          <ProductItemActionMenu row={row} onViewDetailItem={onViewDetailItem} />
        </div>
      </div>
    )
  }));

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
      onClickItem={(id) => router.push(`/orders/${id}`)}
      selectAction={
        <Dropdown
          className="left-0 w-[160px] dark:bg-gunmetal"
          mainMenu={
            <Image src="/three-dot.svg" width={20} height={20} alt="Picture of the author" />
          }
        >
          <div className="rounded-lg "></div>
        </Dropdown>
      }
    />
  );
};
