import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';

export const headerTablePackageRule = [
  {
    id: 'sku',
    label: 'SKU'
  },
  {
    id: 'quantity',
    label: 'Quantity'
  },
  {
    id: 'height',
    label: 'Height'
  },
  {
    id: 'Length',
    label: 'length'
  },
  {
    id: 'Weight',
    label: 'weight'
  },
  {
    id: 'Width',
    label: 'width'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

const Package = () => {
  const renderBodyTable = []?.map((row: any, index: number) => ({
    sku: '-',
    quantity: '-',
    height: '-',
    length: '-',
    weight: '-',
    width: '-',
    action: (
      <div className="flex items-center justify-center">
        <div className="absolute"></div>
      </div>
    )
  }));
  return (
    <CardToggle title="Package">
      <div className="mt-4">
        <Table
          columns={headerTablePackageRule}
          loading={false}
          rows={renderBodyTable}
          totalCount={0}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={10}
          pageSize={10}
        />
      </div>
    </CardToggle>
  );
};

export default Package;
