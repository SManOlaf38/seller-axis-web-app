import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';
import { headerTableWarehouse } from '../../containers';

const OrderItem = () => {
  const renderBodyTable = []?.map((row, index) => ({
    orderItem: '-',
    qty: '-'
  }));

  return (
    <CardToggle title="Order Items" className="grid w-full grid-cols-1 gap-2">
      <Table
        columns={headerTableWarehouse}
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

export default OrderItem;
