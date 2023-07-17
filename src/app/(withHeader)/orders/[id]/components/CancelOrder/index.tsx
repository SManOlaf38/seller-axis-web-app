import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import DetailIcon from 'public/detail.svg';
import ActionIcon from 'public/three-dots.svg';
import { ItemOrder } from '../../../interface';

export const headerTableCancelOrder = [
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'qty',
    label: 'QTY'
  },
  {
    id: 'reason',
    label: 'reason'
  },
  {
    id: 'action',
    label: 'action'
  }
];

const cancelCodes = [
  {
    label: 'bad_sku',
    value: 'bad_sku'
  },
  {
    label: 'collateral_impact',
    value: 'collateral_impact'
  },
  {
    label: 'merchant_request',
    value: 'merchant_request'
  },
  {
    label: 'invalid_item_cost',
    value: 'invalid_item_cost'
  },
  {
    label: 'min_order_not_met',
    value: 'min_order_not_met'
  },
  {
    label: 'other',
    value: 'other'
  },
  {
    label: 'out_of_stock',
    value: 'out_of_stock'
  },
  {
    label: 'discontinued',
    value: 'discontinued'
  }
];

const CancelOrder = ({ items }: { items: ItemOrder[] }) => {
  const [dataCancelOrder, setDataCancelOrder] = useState<any>(items);
  const [isOpenPackage, setIsOpenPackage] = useState(false);

  const handleTogglePackage = () => {
    setIsOpenPackage((isOpenPackage) => !isOpenPackage);
  };

  const defaultValues = {
    cancel_qty: 0,
    reason_cancel: ''
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

  useEffect(() => {
    if (items.length > 0) setDataCancelOrder(items);
  }, [items, items.length]);

  const renderBodyTable = dataCancelOrder?.map((row: any, index: number) => ({
    id: index,
    merchant_sku: row.merchant_sku || '-',
    qty: row.qty_ordered || '-',
    reason: row?.reason || 'bad_sku',
    action: (
      <div className="flex items-center justify-center">
        <div className="absolute">
          <Dropdown mainMenu={<ActionIcon />} className="w-24">
            <div className="z-50 rounded-lg ">
              <Button
                onClick={() => {
                  handleTogglePackage();
                }}
                startIcon={<DetailIcon />}
              >
                Edit
              </Button>
            </div>
          </Dropdown>
        </div>
      </div>
    )
  }));
  return (
    <CardToggle title="Cancel Orders" className="grid w-full grid-cols-1 gap-1">
      <Table
        columns={headerTableCancelOrder}
        loading={false}
        rows={renderBodyTable}
        totalCount={0}
        siblingCount={1}
        onPageChange={() => {}}
        currentPage={10}
        pageSize={10}
        isBorder={false}
      />

      <div className="my-4 flex flex-col items-end">
        <Button className="bg-primary500">Cancel Order</Button>
      </div>

      <Modal open={isOpenPackage} title={'Cancel order'} onClose={handleTogglePackage}>
        <form className="flex flex-col gap-4" onSubmit={() => {}}>
          <div>
            <Controller
              control={control}
              name="cancel_qty"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Cancel quantity"
                  required
                  name="cancel_qty"
                  placeholder="0"
                  error={errors.cancel_qty?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="reason_cancel"
              render={({ field }) => (
                <Select
                  {...field}
                  required
                  label="Reason cancel"
                  options={cancelCodes}
                  name="reason_cancel"
                  error={errors.reason_cancel?.message?.toString()}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              color="dark:bg-gunmetal bg-buttonLight"
              onClick={handleTogglePackage}
              type="button"
            >
              Cancel
            </Button>
            <Button color="bg-primary500" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </CardToggle>
  );
};

export default CancelOrder;
