import { Control, Controller, FieldErrors } from 'react-hook-form';

import Autocomplete from '@/components/ui/Autocomplete';
import CardToggle from '@/components/ui/CardToggle';
import { Button } from '@/components/ui/Button';

import type { ListRetailerWarehouse } from '@/app/(withHeader)/warehouse/interface';

type FormWarehouseProps = {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  dataRetailerWarehouse: ListRetailerWarehouse;
  isNotWarehouse: boolean;
  isLoadingUpdateWarehouseOrder: boolean;
  onGetRetailerWarehouse: () => Promise<void>;
};

export default function Warehouse({
  errors,
  control,
  dataRetailerWarehouse,
  isNotWarehouse,
  isLoadingUpdateWarehouseOrder,
  onGetRetailerWarehouse
}: FormWarehouseProps) {
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
            required
            label="Warehouse ID"
            name="retailer_warehouse"
            placeholder="Select Retailer Warehouse"
            onReload={onGetRetailerWarehouse}
            pathRedirect="/warehouse/create"
            error={errors.retailer_warehouse?.message}
          />
        )}
      />
      {isNotWarehouse && (
        <p className="my-2 text-sm font-medium text-red">
          Warehouse ID must be selected before cancelling or confirming shipment
        </p>
      )}
      <div className="my-4 flex flex-col items-end">
        <Button
          disabled={isLoadingUpdateWarehouseOrder || isNotWarehouse}
          isLoading={isLoadingUpdateWarehouseOrder}
          className="bg-primary500 text-white"
        >
          Save
        </Button>
      </div>
    </CardToggle>
  );
}
