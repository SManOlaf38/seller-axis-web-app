import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ProductItemActionMenu } from '../ProductItemActionMenu';
import { Status } from '@/components/ui/Status';

import type { ListOrder } from '../../interface';

import IconAction from 'public/three-dots.svg';

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
  isLoadingAcknowledge: boolean;
  isLoadingShipment: boolean;
  dataOrder: ListOrder;
  onViewDetailItem: (id: number) => void;
  handleAcknowledge: () => void;
  handleShip: () => void;
};

export const TableOrder = (props: TableOrderProps) => {
  const router = useRouter();

  const {
    headerTable,
    selectedItems,
    isLoadingAcknowledge,
    isLoadingShipment,
    onSelectAll,
    onSelectItem,
    totalCount,
    onPageChange,
    page,
    rowsPerPage,
    loading,
    dataOrder,
    onViewDetailItem,
    handleAcknowledge,
    handleShip
  } = props;

  const renderBodyTable = dataOrder.results?.map((row) => ({
    id: row?.id || '',
    po_number: row?.po_number || '',
    customer: row?.customer?.name || '',
    cust_order_number: row?.cust_order_number || '',
    retailer: row.batch?.retailer.name || '',
    status: <Status name={row?.status} /> || '',
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
      currentPage={page + 1}
      pageSize={rowsPerPage}
      onClickItem={(id) => router.push(`/orders/${id}`)}
      selectAction={
        <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
          <div className="rounded-lg ">
            <Button
              className="w-full hover:bg-neutralLight"
              onClick={handleAcknowledge}
              disabled={isLoadingAcknowledge}
              isLoading={isLoadingAcknowledge}
            >
              <span className="items-start text-lightPrimary dark:text-santaGrey">Acknowledge</span>
            </Button>
            <Button
              className="w-full hover:bg-neutralLight"
              onClick={handleShip}
              disabled={isLoadingShipment}
              isLoading={isLoadingShipment}
            >
              <span className="items-start text-lightPrimary dark:text-santaGrey">Ship</span>
            </Button>
          </div>
        </Dropdown>
      }
    />
  );
};
