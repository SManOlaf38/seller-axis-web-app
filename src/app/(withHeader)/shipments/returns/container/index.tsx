'use client';
import { useCallback, useEffect } from 'react';

import useSelectTable from '@/hooks/useSelectTable';
import { Table } from '@/components/ui/Table';
import usePagination from '@/hooks/usePagination';
import { Tracking, headerTableReturns } from '../../constants';
import { convertFormatDateTime } from '@/utils/utils';
import * as actions from '@/app/(withHeader)/shipments/context/action';
import * as services from '@/app/(withHeader)/shipments/fetch';
import { useStoreShipments } from '@/app/(withHeader)/shipments/context/hooks';
import useSearch from '@/hooks/useSearch';
import { Status } from '@/components/ui/Status';

import type { OrderReturn } from '../../interface';

export default function ReturnsContainer() {
  const {
    state: { listOrderReturn, isLoadingOrderReturn },
    dispatch
  } = useStoreShipments();
  const { debouncedSearchTerm } = useSearch('returns');

  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: listOrderReturn?.results
  });

  const renderBodyTable = listOrderReturn?.results?.map((row: OrderReturn) => ({
    id: row?.id,
    order_id: (
      <p
        onClick={row?.order?.id ? () => window.open(`/orders/${row.order.id}`, '_blank') : () => {}}
        className="flex items-center justify-center text-dodgeBlue underline"
      >
        {row?.order?.po_number || '-'}
      </p>
    ),
    return_id: row?.id || '-',
    created_date: <p>{convertFormatDateTime(row?.created_at)}</p>,
    return_to: row?.warehouse?.name || '-',
    tracking_id: (
      <>
        {row?.tracking_number?.length > 0 ? (
          <div>
            {row.tracking_number?.slice(0, 2).map((item: Tracking, index: number) => (
              <span key={index}>
                {index > 0 && ', '}
                {item?.number}
              </span>
            ))}
            {row.tracking_number?.length > 2 && ', ...'}
          </div>
        ) : (
          '-'
        )}
      </>
    ),
    service: row?.service || '-',
    reimbursed: row?.reimbursed_amount ? `$ ${row.reimbursed_amount.toFixed(2)}` : '-',
    status: <Status name={row?.status} />,
    dispute_at: <p>{convertFormatDateTime(row?.dispute_at)}</p>
  }));

  const handleGetOrderReturn = useCallback(async () => {
    try {
      dispatch(actions.getListOrderReturnRequest());
      const res = await services.getListOrderReturnService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      dispatch(actions.getListOrderReturnSuccess(res));
    } catch (error: any) {
      dispatch(actions.getListOrderReturnFailure());
    }
  }, [debouncedSearchTerm, dispatch, page, rowsPerPage]);

  useEffect(() => {
    handleGetOrderReturn();
  }, [handleGetOrderReturn]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full w-full flex-col gap-[18px]">
        <Table
          loading={isLoadingOrderReturn}
          isSelect={false}
          onChangePerPage={onChangePerPage}
          columns={headerTableReturns}
          rows={renderBodyTable}
          isPagination
          selectedItems={selectedItems}
          selectAllTable={onSelectAll}
          selectItemTable={onSelectItem}
          totalCount={listOrderReturn?.count}
          siblingCount={1}
          onPageChange={onPageChange}
          currentPage={page + 1}
          pageSize={rowsPerPage}
        />
      </div>
    </div>
  );
}
