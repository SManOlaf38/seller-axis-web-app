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
}

const FormProductAlias = ({
  errors,
  control,
  isLoading,
  onGetRetailer,
  handleSearch,
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
              name="address"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Address"
                  required
                  name="address"
                  placeholder="Enter address : ABC..."
                  error={errors.name?.message}
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

      <div className="mb-2 flex justify-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-primary500">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

export default FormProductAlias;
