import { ChangeEvent } from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import { Product } from '@/app/(withHeader)/products/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RetailerType } from '../../../interface';

interface FormProductAliasProps {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  isLoading: boolean;
  onGetRetailer: () => Promise<void>;
  onSubmitData: UseFormHandleSubmit<any, undefined>;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  dataProduct: Product[];
  dataRetailer: RetailerType[];
  isEdit?: boolean;
}

const FormProductAlias = ({
  errors,
  control,
  isLoading,
  onGetRetailer,
  handleSearch,
  dataProduct,
  dataRetailer,
  isEdit
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
                  options={[
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
                  ]}
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

      <div className="mb-2 flex justify-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-primary500">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

export default FormProductAlias;
