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
    label: 'Reason'
  },
  {
    id: 'status',
    label: 'Status'
  }
];

type Props = {
  resBulkAcknowledge: never[];
  handleCloseBulkAcknowledge: () => void;
};

export default function ResultBulkAcknowledge({
  resBulkAcknowledge,
  handleCloseBulkAcknowledge
}: Props) {
  const renderBodyTable = resBulkAcknowledge?.map((row: any) => ({
    id: row?.sftp_id,
    po_number: row?.po_number || '-',
    reason: (
      <div className="w-[300px]">
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
      </div>
    ),
    status: <Status name={row?.status} /> || '-'
  }));

  return (
    <div className="dark:header_cus header_cus_light fixed bottom-0 right-0 z-[20] w-auto animate-slideInLeft border bg-paperLight shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen">
      <div className="flex items-center justify-between py-[8px]">
        <span className="pl-3 text-sm font-normal">{resBulkAcknowledge?.length} Rows Selected</span>
        <Button onClick={handleCloseBulkAcknowledge}>
          <CloseIcon />
        </Button>
      </div>
      <Table
        tableRounded={false}
        columns={headerTable}
        rows={renderBodyTable}
        totalCount={0}
        siblingCount={1}
        onPageChange={() => {}}
        isBorder={false}
      />
    </div>
  );
}
