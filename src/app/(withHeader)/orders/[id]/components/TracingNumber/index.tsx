import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';
import Link from 'next/link';
import { Order } from '../../../interface';

export const headerTableTrackingNumber = [
  {
    id: 'box',
    label: 'Box'
  },
  {
    id: 'tracking_number',
    label: 'Tracking number'
  },
  {
    id: 'label',
    label: 'Label'
  }
];

const TrackingNumber = ({ detail }: { detail: Order }) => {
  const renderBodyTable = detail?.shipments?.map((row, index) => ({
    id: index++,
    box: index || '-',
    tracking_number: row.tracking_number || '-',
    label: (
      <Link key={row?.tracking_number} href={`${row.package_document}`} passHref legacyBehavior>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-dodgeBlue underline "
        >
          View
        </a>
      </Link>
    )
  }));

  return (
    <CardToggle title="Tracking number" className="grid w-full grid-cols-1 gap-2">
      <Table
        columns={headerTableTrackingNumber}
        loading={false}
        rows={renderBodyTable}
        totalCount={0}
        siblingCount={1}
        onPageChange={() => {}}
        currentPage={10}
        pageSize={10}
        isBorder={false}
      />
    </CardToggle>
  );
};

export default TrackingNumber;
