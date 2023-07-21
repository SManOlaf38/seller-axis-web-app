import { ChangeEvent } from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import { Product } from '@/app/(withHeader)/products/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RetailerType } from '../../../interface';
import { Items } from '../../containers';
import { CheckBox } from '@/components/ui/CheckBox';

export const headerTableWarehouse = [
  {
    id: 'retailer_warehouse',
    label: 'Retailer warehouse'
  },
  {
    id: 'qty_on_hand',
    label: 'QTY on hand'
  },
  {
    id: 'next_available_qty',
    label: 'Next available QTY'
  },
  {
    id: 'next_available_date',
    label: 'Next available date'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

const dataService = [
  {
    label: 'Amazon',
    value: 1
  },
  {
    label: 'Walmart',
    value: 2
  },
  {
    label: 'CommerceHub',
    value: 3
  }
];

interface FormProductAliasProps {
  error: string;
  errors: FieldErrors<any>;
  control: Control<any, any>;
  isLoading: boolean;
  onGetRetailer: () => Promise<void>;
  onSubmitData: UseFormHandleSubmit<any, undefined>;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  dataProduct: Product[];
  dataRetailer: RetailerType[];
  isEdit?: boolean;
  currentServices: {
    label: string;
    value: number;
  };
  retailerArray: Items[];
  handleUpdateProductWarehouse: (data: Items) => void;
  handleDeleteRetailerArray: (data: Items) => Promise<void>;
}

const FormProductAlias = ({
  error,
  errors,
  control,
  isLoading,
  onGetRetailer,
  handleSearch,
  dataProduct,
  dataRetailer,
  isEdit,
  currentServices
}: FormProductAliasProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Controller
              control={control}
              name="services"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={dataService}
                  handleChangeText={handleSearch}
                  required
                  addNew={false}
                  label="Services"
                  name="services"
                  placeholder="Select services"
                  onReload={onGetRetailer}
                  pathRedirect="/services/create"
                  error={errors.services?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="retailer"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    dataRetailer?.map((item) => ({
                      value: item.id,
                      label: item.name
                    })) || []
                  }
                  disabled={!currentServices?.value}
                  handleChangeText={handleSearch}
                  required
                  label="Retailer"
                  name="retailer"
                  placeholder="Select retailer"
                  onReload={onGetRetailer}
                  pathRedirect="/retailers/create"
                  error={errors.retailer?.message}
                />
              )}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Controller
              control={control}
              name="product"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    dataProduct.map((item) => ({
                      value: item.id,
                      label: item.sku
                    })) || []
                  }
                  handleChangeText={handleSearch}
                  required
                  label="Product"
                  name="product"
                  placeholder="Select product"
                  onReload={onGetRetailer}
                  pathRedirect="/products/create"
                  error={errors.product?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="sku"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter SKU : IB-001..."
                  label="SKU Alias"
                  required
                  name="sku"
                  error={errors.sku?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="merchant_sku"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter merchant SKU"
                  label="Merchant SKU"
                  required
                  name="merchant_sku"
                  error={errors.merchant_sku?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="vendor_sku"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Vendor SKU"
                  label="Vendor SKU"
                  required
                  name="vendor_sku"
                  error={errors.vendor_sku?.message}
                />
              )}
            />
          </div>

        </div>
      </Card>

      <div className="mb-2 flex flex-col items-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-primary500">
          {isEdit ? 'Update' : 'Create'}
        </Button>

        {error && <p className="mb-2 mt-1 block text-sm font-medium text-red">{error as string}</p>}
      </div>
    </div>
  );
};

export default FormProductAlias;
