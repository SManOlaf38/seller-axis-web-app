import { useRouter } from 'next/navigation';

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
  resBulkVerify: never[];
  isLoadingVerifyBulk: boolean;
  handleCloseBulkVerify: () => void;
};

export default function ResultBulkVerify({
  isLoadingVerifyBulk,
  resBulkVerify,
  handleCloseBulkVerify
}: Props) {
  const router = useRouter();

  const renderBodyTable = resBulkVerify?.map((row: any) => ({
    id: row?.id || '',
    po_number: <p className="underline">{row?.po_number || '-'}</p>,
    reason: (
      <div className="w-[300px]">
        <p className="whitespace-normal break-words text-start">
          {row?.status === 'FAILED'
            ? row?.data?.error?.detail ||
              row?.data?.error?.detail?.response?.errors[0]?.message ||
              row?.data?.error?.detail?.errors[0]?.message
            : 'Verify Address Successfully'}
        </p>
      </div>
    ),
    status: <Status name={row?.status} /> || '-'
  }));

  return (
    <div className="dark:header_cus header_cus_light fixed bottom-0 right-0 z-[20] w-auto animate-slideInLeft border bg-paperLight shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen">
      <div className="flex items-center justify-between py-[8px]">
        <span className="pl-3 text-sm font-normal">{resBulkVerify?.length} Rows Selected</span>
        <Button onClick={handleCloseBulkVerify}>
          <CloseIcon />
        </Button>
      </div>
      <Table
        tableRounded={false}
        columns={headerTable}
        loading={isLoadingVerifyBulk}
        rows={renderBodyTable}
        totalCount={0}
        siblingCount={1}
        onPageChange={() => {}}
        onClickItem={(id) => router.push(`/orders/${id}`)}
        isBorder={false}
      />
    </div>
  );
}
