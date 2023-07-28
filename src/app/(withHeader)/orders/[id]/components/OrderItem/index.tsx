import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';
import { headerTableWarehouse } from '../../containers';
import type { ItemOrder } from '../../../interface';

const OrderItem = ({ items }: { items: ItemOrder[] }) => {
  const renderBodyTable = items?.map((row, index) => ({
    id: index,
    product_alias: row?.product_alias?.sku || '-',
    merchant_sku: row.merchant_sku || '-',
    qty: row.qty_ordered || '-',
    unit_cost: `$ ${row.unit_cost}` || '-'
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
