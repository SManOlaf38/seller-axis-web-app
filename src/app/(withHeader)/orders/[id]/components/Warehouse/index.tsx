import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useMemo } from 'react';

import AlertWarningIcon from 'public/alert-warning.svg';
import Autocomplete from '@/components/ui/Autocomplete';
import CardToggle from '@/components/ui/CardToggle';
import { Button } from '@/components/ui/Button';

import type { ListRetailerWarehouse } from '@/app/(withHeader)/warehouse/interface';
import type { ItemOrder, Order } from '../../../interface';

type FormWarehouseProps = {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  dataRetailerWarehouse: ListRetailerWarehouse;
  isLoadingUpdateWarehouseOrder: boolean;
  isMatchWarehouse: boolean;
  orderDetail: Order;
  itemWarehousesNotSelect: ItemOrder[];
  retailerWarehouse: {
    value: number;
    label: string;
  };
  onGetRetailerWarehouse: () => Promise<void>;
  setValueWarehouse: UseFormSetValue<any>;
};

const TextWarning = ({ content }: { content: string }) => {
  return (
    <div className="my-2 flex">
      <div className="flex h-6 w-6 items-center">
        <AlertWarningIcon />
      </div>
      <p className="pl-2 text-sm text-yellow">{content}</p>
    </div>
  );
};

export default function Warehouse({
  errors,
  control,
  dataRetailerWarehouse,
  isLoadingUpdateWarehouseOrder,
  orderDetail,
  itemWarehousesNotSelect,
  retailerWarehouse,
  isMatchWarehouse,
  onGetRetailerWarehouse,
  setValueWarehouse
}: FormWarehouseProps) {
  const listProductAliasSku = useMemo(() => {
    return JSON.stringify(
      itemWarehousesNotSelect?.map((item) =>
        item?.product_alias?.sku === undefined ? '-' : item?.product_alias?.sku
      )
    );
  }, [itemWarehousesNotSelect]);

  const listProductAliasName = useMemo(() => {
    return JSON.stringify(
      itemWarehousesNotSelect?.map((item) =>
        item?.product_alias?.product_name === undefined ? '-' : item?.product_alias?.product_name
      )
    );
  }, [itemWarehousesNotSelect]);

  return (
    <CardToggle title="Warehouse" className="grid w-full grid-cols-1 gap-2">
      <Controller
        control={control}
        name="retailer_warehouse"
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={
              dataRetailerWarehouse?.results?.map((item: any) => ({
                value: item?.id,
                label: item?.name
              })) || []
            }
            label="Warehouse ID"
            required
            name="retailer_warehouse"
            placeholder="Select Retailer Warehouse"
            onReload={onGetRetailerWarehouse}
            pathRedirect="/warehouse/create"
            setValueInputForm={setValueWarehouse}
            valueInputFrom="retailer_warehouse"
            error={errors.retailer_warehouse?.message}
          />
        )}
      />
      {!isMatchWarehouse && (
        <TextWarning
          content={`The warehouse [${
            orderDetail?.vendor_warehouse_id || '-'
          }] of the PO does not match the
         warehouse list of the organization.`}
        />
      )}
      {itemWarehousesNotSelect?.length > 0 && (
        <TextWarning
          content={`Product Alias ${listProductAliasSku} associating to ${listProductAliasName} don’t have
            inventory data with warehouse [${retailerWarehouse?.label || '-'}] defined in PO’s
            detail.`}
        />
      )}

      {Boolean(!retailerWarehouse) && (
        <p className="my-2 text-sm text-red">
          Warehouse ID must be selected before cancelling or confirming shipment
        </p>
      )}
      <div className="my-4 flex flex-col items-end">
        <Button
          disabled={isLoadingUpdateWarehouseOrder || Boolean(!retailerWarehouse)}
          isLoading={isLoadingUpdateWarehouseOrder}
          className="bg-primary500 text-white"
        >
          Save
        </Button>
      </div>
    </CardToggle>
  );
}
