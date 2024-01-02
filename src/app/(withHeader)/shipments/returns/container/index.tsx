/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import useSelectTable from '@/hooks/useSelectTable';
import { Table } from '@/components/ui/Table';
import usePagination from '@/hooks/usePagination';
import { Tracking, fakeData, headerTableReturns } from '../../constants';
import { convertFormatDateTime } from '@/utils/utils';
import { Radius } from '@/components/ui/Radius';

export default function ReturnsContainer() {
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: []
  });
  const dataReturns = [] as any;

  const renderBodyTable = fakeData?.map((row: any) => ({
    id: row?.id,
    order_id: (
      <p
        onClick={
          row?.order_id?.id ? () => window.open(`/orders/${row.order_id.id}`, '_blank') : () => {}
        }
        className="flex items-center justify-center text-dodgeBlue underline"
      >
        {row?.order_id?.id || '-'}
      </p>
    ),
    return_id: (
      <p
        onClick={
          row?.return_id ? () => window.open(`/orders/${row.return_id}`, '_blank') : () => {}
        }
        className="flex items-center justify-center text-dodgeBlue underline"
      >
        {row?.return_id || '-'}
      </p>
    ),
    created_date: <p>{convertFormatDateTime(row?.created_date)}</p>,
    return_to: row?.return_to || '-',
    tracking_id: (
      <>
        {row?.tracking_id?.length > 0 ? (
          <div>
            {row.tracking_id?.slice(0, 2).map((item: Tracking, index: number) => (
              <span key={item?.id}>
                {index > 0 && ', '}
                {item?.id}
              </span>
            ))}
            {row.tracking_id?.length > 2 && ', ...'}
          </div>
        ) : (
          '-'
        )}
      </>
    ),
    service: row?.service || '-',
    reimbursed: row?.reimbursed ? `$ ${row.reimbursed.toFixed(2)}` : '-',
    dispute: (
      <div className="flex items-center justify-center">
        <Radius checked={row?.dispute || false} />
      </div>
    ),
    dispute_at: <p>{convertFormatDateTime(row?.dispute_at)}</p>
  }));

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full w-full flex-col gap-[18px]">
        <Table
          isSelect={false}
          onChangePerPage={onChangePerPage}
          columns={headerTableReturns}
          rows={renderBodyTable}
          isPagination
          selectedItems={selectedItems}
          selectAllTable={onSelectAll}
          selectItemTable={onSelectItem}
          totalCount={dataReturns?.count}
          siblingCount={1}
          onPageChange={onPageChange}
          currentPage={page + 1}
          pageSize={rowsPerPage}
        />
      </div>
    </div>
  );
}
