import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import Image from 'next/image';

import AlertIcon from 'public/alert.svg';
import Autocomplete from '@/components/ui/Autocomplete';
import CardToggle from '@/components/ui/CardToggle';
import { Button } from '@/components/ui/Button';

import type { ListRetailerWarehouse } from '@/app/(withHeader)/warehouse/interface';
import type { ItemOrder, Order } from '../../../interface';
import { useMemo } from 'react';
import Tooltip from '@/components/ui/Tooltip';

type FormWarehouseProps = {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  dataRetailerWarehouse: ListRetailerWarehouse;
  isLoadingUpdateWarehouseOrder: boolean;
  isHaveWarehouseOfPo: boolean;
  orderDetail: Order;
  itemWarehousesNotSelect: ItemOrder[];
  retailerWarehouse: {
    value: number;
    label: string;
  };
  onGetRetailerWarehouse: () => Promise<void>;
  setValueWarehouse: UseFormSetValue<any>;
};

export default function Warehouse({
  errors,
  control,
  dataRetailerWarehouse,
  isLoadingUpdateWarehouseOrder,
  isHaveWarehouseOfPo,
  orderDetail,
  itemWarehousesNotSelect,
  retailerWarehouse,
  onGetRetailerWarehouse,
  setValueWarehouse
}: FormWarehouseProps) {
  const listProductAliasSku = useMemo(() => {
    return JSON.stringify(itemWarehousesNotSelect?.map((item) => item?.product_alias?.sku));
  }, [itemWarehousesNotSelect]);

  const listProductAliasName = useMemo(() => {
    return JSON.stringify(
      itemWarehousesNotSelect?.map((item) => item?.product_alias?.product_name)
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
            label={
              <>
                <p className="mr-1">Warehouse ID </p>
                <Tooltip content="Warehouse ID must be selected before cancelling or confirming shipment">
                  <Image src="/question-icon.svg" width={16} height={16} alt="question" />
                </Tooltip>
              </>
            }
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
      {itemWarehousesNotSelect?.length > 0 && (
        <div className="my-2 flex w-full justify-center">
          <div className="flex h-6 w-6 items-center">
            <AlertIcon />
          </div>
          <p className="pl-2 text-sm text-paleRed">
            Product Alias {listProductAliasSku} associating to {listProductAliasName} don’t have
            inventory data with warehouse [{retailerWarehouse?.label || '-'}] defined in PO’s
            detail.
          </p>
        </div>
      )}
      {isHaveWarehouseOfPo && (
        <p className="my-2 text-sm text-red">
          The warehouse [{orderDetail?.vendor_warehouse_id || '-'}] of the PO does not match the
          warehouse list of the organization.
        </p>
      )}

      <div className="my-4 flex flex-col items-end">
        <Button
          disabled={isLoadingUpdateWarehouseOrder || isHaveWarehouseOfPo}
          isLoading={isLoadingUpdateWarehouseOrder}
          className="bg-primary500 text-white"
        >
          Save
        </Button>
      </div>
    </CardToggle>
  );
}
