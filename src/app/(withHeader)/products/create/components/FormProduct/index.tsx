import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import { UploadImageCom } from '@/components/common/UploadImage';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { ChangeEvent } from 'react';
import { DATA_AVAILABLE, DATA_UNI_OF_MEASURES } from '../../../constants';
import { PackageRuleType } from '../../../interface';

interface FormProductProps {
  image: string;
  onChangeImage: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDeleteImage: () => void;
  errors: FieldErrors<any>;
  control: Control<any, any>;
  isLoading: boolean;
  packageRules: PackageRuleType[];
  onGetPackageRule: () => Promise<void>;
  onRedirect: (name: string) => void;
  onSubmitData: UseFormHandleSubmit<any, undefined>;
}

const FormProduct = ({
  image,
  onChangeImage,
  onDeleteImage,
  errors,
  control,
  isLoading,
  packageRules,
  onGetPackageRule,
  onRedirect
}: FormProductProps) => {
  // const renderBodyTable = []?.map((row: any, index: number) => ({
  //   location: '-',
  //   cost: '-',
  //   action: (
  //     <div className="flex items-center justify-center">
  //       <div className="absolute"></div>
  //     </div>
  //   )
  // }));

  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <UploadImageCom
            label="Product Picture"
            image={image}
            onChangeImage={onChangeImage}
            onDeleteImage={onDeleteImage}
            name="picture"
            error={errors?.image?.message?.toString() || ''}
          />
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
          <div>
            <Controller
              control={control}
              name="sku"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter SKU : IB-001..."
                  label="SKU"
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
              name="unit_of_measure"
              render={({ field }) => (
                <Select
                  {...field}
                  label="Unit of measure"
                  options={DATA_UNI_OF_MEASURES}
                  name="unit_of_measure"
                  error={errors.unit_of_measure?.message?.toString()}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="available"
              render={({ field }) => (
                <Select
                  {...field}
                  label="Available"
                  options={DATA_AVAILABLE}
                  name="available"
                  error={errors.available?.message?.toString()}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="upc"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter UPC"
                  label="UPC"
                  required
                  name="upc"
                  error={errors.upc?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="qty_reserve"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Qty reserve"
                  required
                  type="number"
                  name="qty_reserve"
                  placeholder="0"
                  error={errors.qty_reserve?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="unit_cost"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Unit cost"
                  required
                  type="number"
                  placeholder="0"
                  name="unit_cost"
                  className="px-3 py-2"
                  error={errors.unit_cost?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="qty_on_hand"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Qty on hand"
                  required
                  type="number"
                  placeholder="0"
                  name="qty_on_hand"
                  error={errors.qty_on_hand?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="package_rule"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    packageRules?.map((item: any) => ({
                      label: item?.name,
                      value: item?.id
                    })) || []
                  }
                  required
                  label="Package rule"
                  name="package_rule"
                  placeholder="Select package rule"
                  onReload={onGetPackageRule}
                  onRedirect={onRedirect}
                />
              )}
            />
          </div>
        </div>
      </Card>

      {/* <Card>
        <label className="mb-2 block text-sm font-medium">Warehouse</label>
        <div className="mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Controller
              control={control}
              name="warehouse"
              render={({ field }) => (
                <Autocomplete
                  options={
                    [].map((item: any) => ({
                      label: item.code,
                      value: item.id
                    })) || []
                  }
                  label="Location"
                  name="warehouse"
                  value={field.value}
                  onChange={field.onChange}
                  className="border-none px-3 py-2"
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="cost"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Cost"
                  type="number"
                  name="cost"
                  className="border-none px-3 py-2"
                  error={errors.cost?.message}
                />
              )}
            />
          </div>
        </div>

        <Table
          columns={headerTableWarehouse}
          loading={false}
          rows={renderBodyTable}
          totalCount={0}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={10}
          pageSize={10}
        />
      </Card> */}

      <div className="mb-2 flex justify-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-primary500">
          Create Product
        </Button>
      </div>
    </div>
  );
};

export default FormProduct;
