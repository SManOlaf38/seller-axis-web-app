import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';
import type { ItemOrder } from '../../../interface';
import { Retailer } from '@/app/(withHeader)/retailers/interface';
import { headerTableWarehouse } from '../../../constants';

const OrderItem = ({ items, retailer }: { items: ItemOrder[]; retailer: Retailer }) => {
  const changePageProductAlias = (merchant_sku: string) => {
    localStorage.setItem(
      'merchant_sku',
      JSON.stringify({
        merchant_sku,
        retailer
      })
    );
    window.open('/product-aliases/create', '_blank');
  };

  const renderBodyTable = items?.map((row, index) => ({
    id: index,
    product_alias: row?.product_alias?.sku || (
      <p
        onClick={() => changePageProductAlias(row?.merchant_sku)}
        className="flex items-center justify-center text-dodgeBlue underline"
      >
        Create new Product Alias
      </p>
    ),
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
