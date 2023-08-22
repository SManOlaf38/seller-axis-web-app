import { ChangeEvent } from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Retailer } from '@/app/(withHeader)/retailers/interface';
import { DataCountryRegion } from '@/constants';
import { Select } from '@/components/ui/Select';
import { RetailerCarrier } from '../../../interface';

type Key = {
  [key: string]: string | number | object;
  shipper: {
    name: string;
    attention_name: string;
    tax_identification_number: string;
    phone: string;
    email: string;
    shipper_number: string;
    fax_number: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    company: string;
  };
};

interface FormRetailerCarrierProps {
  error: string;
  errors: FieldErrors<Key>;
  control: Control<any, any>;
  isLoading: boolean;
  onGetRetailer: () => Promise<void>;
  onSubmitData: UseFormHandleSubmit<any, undefined>;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  dataRetailer: Retailer[];
  isEdit?: boolean;
  dataServices: any[];
  onGetServices: () => Promise<void>;
  detail?: RetailerCarrier;
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
  onGetServices,
  detail
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
                  addNew={false}
                  placeholder="Select service"
                  // onReload={onGetServices}
                  // pathRedirect="/services/create"
                  error={errors.service?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="account_number"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter account number"
                  label="Account number"
                  required
                  name="account_number"
                  error={errors.account_number?.message}
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

      {detail && detail.id && (
        <>
          <h2 className="text-lg font-semibold">Shipper</h2>
          <Card>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Controller
                  control={control}
                  name="shipper.name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter name"
                      label="Name"
                      required
                      name="shipper.name"
                      error={errors?.shipper?.name?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="shipper.attention_name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter attention name"
                      label="Attention name"
                      required
                      name="shipper.attention_name"
                      error={errors?.shipper?.attention_name?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="shipper.tax_identification_number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter tax identification number"
                      label="Tax identification number"
                      required
                      name="shipper.tax_identification_number"
                      error={errors?.shipper?.tax_identification_number?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="shipper.phone"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter phone"
                      label="Phone"
                      required
                      type="number"
                      name="shipper.phone"
                      error={errors?.shipper?.phone?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="shipper.email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter email"
                      label="Email"
                      required
                      name="shipper.email"
                      error={errors?.shipper?.email?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="shipper.shipper_number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter shipper number"
                      label="Shipper number"
                      required
                      name="shipper.shipper_number"
                      error={errors?.shipper?.shipper_number?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="shipper.fax_number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter fax number"
                      label="Fax number"
                      name="shipper.fax_number"
                      error={errors?.shipper?.fax_number?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="shipper.address"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter address"
                      label="Address"
                      required
                      name="shipper.address"
                      error={errors?.shipper?.address?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="shipper.city"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter city"
                      label="City"
                      required
                      name="shipper.city"
                      error={errors?.shipper?.city?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="shipper.state"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter state"
                      label="State"
                      required
                      name="shipper.state"
                      error={errors?.shipper?.state?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="shipper.postal_code"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter postal code"
                      label="Postal code"
                      required
                      type="number"
                      name="shipper.postal_code"
                      error={errors?.shipper?.postal_code?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="shipper.country"
                  render={({ field }) => (
                    <Select
                      {...field}
                      required
                      label="Country"
                      options={DataCountryRegion}
                      name="shipper.country"
                      error={errors?.shipper?.country?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="shipper.company"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter company"
                      label="Company"
                      required
                      name="shipper.company"
                      error={errors?.shipper?.company?.message}
                    />
                  )}
                />
              </div>
            </div>
          </Card>
        </>
      )}

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
