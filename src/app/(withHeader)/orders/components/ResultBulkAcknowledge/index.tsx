import clsx from 'clsx';

import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import CloseIcon from 'public/close.svg';
import { Status } from '@/components/ui/Status';

const headerTable = [
  {
    id: 'po_number',
    label: 'PO number'
  },
  {
    id: 'reason',
    label: 'Detail'
  },
  {
    id: 'status',
    label: 'Status'
  }
];

type Props = {
  resBulkAcknowledge: never[];
  isLoadingAcknowledge: boolean;
  handleCloseBulkAcknowledge: () => void;
};

export default function ResultBulkAcknowledge({
  resBulkAcknowledge,
  isLoadingAcknowledge,
  handleCloseBulkAcknowledge
}: Props) {
  const renderBodyTable = resBulkAcknowledge?.map((row: any) => ({
    id: row?.sftp_id,
    po_number: row?.po_number || '-',
    reason: (
      <div className="flex w-[300px] items-center">
        <p
          className={clsx('whitespace-normal break-words', {
            'text-dodgeBlue underline': row?.status === 'FAILED'
          })}
          onClick={
            row?.status === 'FAILED'
              ? () => window.open(`/sftp/${row?.sftp_id}`, '_blank')
              : () => {}
          }
        >
          {row?.status === 'FAILED'
            ? row?.data?.error?.sftp_folder_not_found || row?.data?.error?.default_code
            : 'Acknowledge Successfully'}
        </p>

        {row?.status === 'FAILED' && (
          <>
            <p className="px-2">|</p>
            <p className="whitespace-normal break-words text-paleRed underline">Bypass</p>
          </>
        )}
      </div>
    ),
    status: <Status name={row?.status} /> || '-'
  }));

  return (
    <div className="dark:header_cus header_cus_light fixed bottom-0 right-0 z-[20] w-auto animate-slideInLeft border bg-paperLight shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen">
      <div className="flex items-center justify-between py-[8px]">
        <p className="cursor-pointer whitespace-normal break-words pl-4 text-paleRed underline">
          Bypass All
        </p>
        <Button onClick={handleCloseBulkAcknowledge}>
          <CloseIcon />
        </Button>
      </div>
      <Table
        tableRounded={false}
        columns={headerTable}
        loading={isLoadingAcknowledge}
        rows={renderBodyTable}
        totalCount={0}
        siblingCount={1}
        onPageChange={() => {}}
        isBorder={false}
      />
    </div>
  );
}
