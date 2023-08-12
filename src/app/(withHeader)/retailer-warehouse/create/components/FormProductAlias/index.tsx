import { ChangeEvent } from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import { Retailer } from '@/app/(withHeader)/retailers/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';

interface FormProductAliasProps {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  isLoading: boolean;
  onGetRetailer: () => Promise<void>;
  onSubmitData: UseFormHandleSubmit<any, undefined>;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  dataRetailer: Retailer[];
  isEdit?: boolean;
  error: string;
}

const FormProductAlias = ({
  errors,
  control,
  isLoading,
  onGetRetailer,
  handleSearch,
  dataRetailer,
  isEdit,
  error
}: FormProductAliasProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
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
          <div>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Name"
                  required
                  name="name"
                  placeholder="Enter name : ABC..."
                  error={errors.name?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="address_1"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Address 1"
                  required
                  name="address_1"
                  placeholder="Enter address 1 : ABC..."
                  error={errors.address_1?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="address_2"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Address 2"
                  name="address_2"
                  placeholder="Enter address 2 : ABC..."
                  error={errors.address_2?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <Input
                  {...field}
                  label="City"
                  name="city"
                  placeholder="Enter city : ABC..."
                  error={errors.city?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <Input
                  {...field}
                  label="State"
                  name="state"
                  placeholder="Enter state : ABC..."
                  error={errors.state?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="postal_code"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Postal code"
                  name="postal_code"
                  placeholder="Enter postal code : ABC..."
                  error={errors.postal_code?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Country"
                  name="country"
                  placeholder="Enter country : ABC..."
                  error={errors.country?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Phone"
                  name="phone"
                  placeholder="Enter phone"
                  error={errors.phone?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={4}
                  label="Description"
                  required
                  name="description"
                  placeholder="Enter description"
                  error={errors.description?.message}
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
