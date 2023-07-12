import { ChangeEvent } from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import { Product } from '@/app/(withHeader)/products/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RetailerType } from '../../../interface';

interface FormSFTPProps {
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

const FormSFTP = ({
  errors,
  control,
  isLoading,
  onGetRetailer,
  handleSearch,
  dataProduct,
  dataRetailer,
  isEdit
}: FormSFTPProps) => {
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
                    dataRetailer.map((item) => ({
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
              name="sftp_host"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter SFTP host"
                  label="SFTP host"
                  required
                  name="sftp_host"
                  error={errors.sftp_host?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="sftp_username"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter SFTP username"
                  label="SFTP username"
                  required
                  name="sftp_username"
                  error={errors.sftp_username?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="sftp_password"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter SFTP password"
                  label="SFTP password"
                  required
                  type="password"
                  name="sftp_password"
                  error={errors.sftp_password?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="purchase_orders_sftp_directory"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Purchase orders SFTP directory"
                  label="Purchase orders SFTP directory"
                  name="purchase_orders_sftp_directory"
                  error={errors.purchase_orders_sftp_directory?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="acknowledgment_sftp_directory"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Acknowledgment SFTP directory"
                  label="Acknowledgment SFTP directory"
                  name="acknowledgment_sftp_directory"
                  error={errors.acknowledgment_sftp_directory?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="confirm_sftp_directory"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Confirm SFTP directory"
                  label="Confirm SFTP directory"
                  name="confirm_sftp_directory"
                  error={errors.confirm_sftp_directory?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="inventory_sftp_directory"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Inventory SFTP directory"
                  label="Inventory SFTP directory"
                  name="inventory_sftp_directory"
                  error={errors.inventory_sftp_directory?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="invoice_sftp_directory"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter invoice SFTP directory"
                  label="Invoice SFTP directory"
                  name="invoice_sftp_directory"
                  error={errors.invoice_sftp_directory?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="return_sftp_directory"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Return SFTP directory"
                  label="Return SFTP directory"
                  name="return_sftp_directory"
                  error={errors.return_sftp_directory?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="payment_sftp_directory"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Payment SFTP directory"
                  label="Payment SFTP directory"
                  name="payment_sftp_directory"
                  error={errors.payment_sftp_directory?.message}
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

export default FormSFTP;
