import { ChangeEvent } from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Retailer } from '@/app/(withHeader)/retailers/interface';

interface FormRetailerCarrierProps {
  error: string;
  errors: FieldErrors<any>;
  control: Control<any, any>;
  isLoading: boolean;
  onGetRetailer: () => Promise<void>;
  onSubmitData: UseFormHandleSubmit<any, undefined>;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  dataRetailer: Retailer[];
  isEdit?: boolean;
  dataServices: any[];
  onGetServices: () => Promise<void>;
}

const FormRetailerCarrier = ({
  error,
  errors,
  control,
  isLoading,
  onGetRetailer,
  handleSearch,
  // dataProduct,
  dataRetailer,
  isEdit,
  dataServices,
  onGetServices
}: FormRetailerCarrierProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Controller
              control={control}
              name="service"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    dataServices?.map((item) => ({
                      label: item?.name,
                      value: item?.id
                    })) || []
                  }
                  handleChangeText={handleSearch}
                  required
                  label="Service"
                  name="service"
                  placeholder="Select service"
                  onReload={onGetServices}
                  pathRedirect="/services/create"
                  error={errors.service?.message}
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

          <div>
            <Controller
              control={control}
              name="client_id"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter client ID"
                  label="Client ID"
                  required
                  name="client_id"
                  error={errors.client_id?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="client_secret"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter client secret"
                  label="Client secret"
                  required
                  name="client_secret"
                  error={errors.client_secret?.message}
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

export default FormRetailerCarrier;
