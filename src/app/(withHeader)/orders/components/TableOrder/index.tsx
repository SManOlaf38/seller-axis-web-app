import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { type ChangeEvent } from 'react';
import Link from 'next/link';

import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ProductItemActionMenu } from '../ProductItemActionMenu';
import { Status } from '@/components/ui/Status';

import type { ListOrder, Order } from '../../interface';
import IconAction from 'public/three-dots.svg';

type TableOrderProps = {
  headerTable: {
    id: string;
    label: string;
    dataField?: string;
  }[];
  selectedItems: number[];
  itemsNotShipped: Order[];
  onSelectAll: () => void;
  onSelectItem: (id: number) => void;
  totalCount: number;
  onPageChange: (value: string | number) => void;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  isLoadingAcknowledge: boolean;
  isLoadingShipment: boolean;
  isLoadingVerifyBulk: boolean;
  dataOrder: ListOrder;
  itemsNotInvoiced: Order[];
  itemsAck: never[];
  onViewDetailItem: (id: number) => void;
  handleBulkVerify: () => Promise<void>;
  handleAcknowledge: () => void;
  handleShip: () => void;
  onChangePerPage: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export const TableOrder = (props: TableOrderProps) => {
  const router = useRouter();

  const {
    headerTable,
    selectedItems,
    isLoadingAcknowledge,
    isLoadingShipment,
    itemsNotShipped,
    onSelectAll,
    onSelectItem,
    totalCount,
    onPageChange,
    page,
    rowsPerPage,
    itemsAck,
    loading,
    dataOrder,
    itemsNotInvoiced,
    isLoadingVerifyBulk,
    onViewDetailItem,
    handleAcknowledge,
    handleBulkVerify,
    handleShip,
    onChangePerPage
  } = props;
  const pathname = usePathname();

  const renderBodyTable = dataOrder.results?.map((row) => ({
    id: row?.id || '',
    po_number: (
      <>
        {row?.po_number ? (
          <Link className="block w-full" href={`${pathname}/${row.id}`}>
            {row?.po_number}
          </Link>
        ) : (
          '-'
        )}
      </>
    ),
    customer: row?.customer?.name || row?.ship_to?.name || '',
    cust_order_number: row?.cust_order_number || '',
    retailer: row.batch?.retailer.name || '',
    verify_address: row?.verified_ship_to ? (
      <Status name={row?.verified_ship_to?.status} />
    ) : (
      <Status name={'UNVERIFIED'} />
    ),
    status: <Status name={row?.status} /> || '',
    order_date: dayjs(row?.order_date).format('MM/DD/YYYY') || '',
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
      onClickItem={(id) => router.push(`/orders/${id}`)}
      selectAction={
        <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
          <div className="rounded-lg ">
            <Button
              className={clsx('w-full', {
                'hover:bg-neutralLight': itemsAck.length !== 0
              })}
              onClick={handleAcknowledge}
              disabled={isLoadingAcknowledge || itemsAck.length === 0}
              isLoading={isLoadingAcknowledge}
            >
              <span className="items-start text-lightPrimary dark:text-santaGrey">Acknowledge</span>
            </Button>
            <Button
              className="w-full hover:bg-neutralLight"
              onClick={handleBulkVerify}
              disabled={isLoadingVerifyBulk}
              isLoading={isLoadingVerifyBulk}
            >
              <span className="items-start text-lightPrimary dark:text-santaGrey">
                Verify Address
              </span>
            </Button>
            <Button
              className={clsx('w-full', {
                'hover:bg-neutralLight': itemsNotInvoiced.length !== 0
              })}
              onClick={handleShip}
              disabled={isLoadingShipment || itemsNotInvoiced.length === 0}
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
