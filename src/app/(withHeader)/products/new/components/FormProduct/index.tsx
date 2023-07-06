import { Controller } from 'react-hook-form';

import { UploadImageCom } from '@/components/common/UploadImage';
import Autocomplete from '@/components/ui/Autocomplete';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { TextArea } from '@/components/ui/TextArea';
import useHandleImage from '@/hooks/useHandleImage';
import { DATA_AVAILABLE, DATA_UNI_OF_MEASURES, headerTableWarehouse } from '../../../constants';
import { FormProductProps } from '../../../interface';

const FormProduct = ({ errors, control }: FormProductProps) => {
  const { image, onDeleteImage, handleImage } = useHandleImage();

  const renderBodyTable = []?.map((row: any, index: number) => ({
    location: '-',
    cost: '-',
    action: (
      <div className="flex items-center justify-center">
        <div className="absolute"></div>
      </div>
    )
  }));

  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <UploadImageCom
            label="Product Picture"
            image={image}
            onChangeImage={handleImage}
            onDeleteImage={onDeleteImage}
            name="picture"
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
                  isRequired
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
                <Input {...field} label="SKU" isRequired name="sku" error={errors.sku?.message} />
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
                  label="Available"
                  options={DATA_UNI_OF_MEASURES}
                  name="unit_of_measure"
                  error={errors.unit_of_measure?.message}
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
                  error={errors.available?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="upc"
              render={({ field }) => (
                <Input {...field} label="UPC" isRequired name="upc" error={errors.upc?.message} />
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
                  isRequired
                  type="number"
                  name="qty_reserve"
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
                  isRequired
                  type="number"
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
                  isRequired
                  type="number"
                  name="qty_on_hand"
                  error={errors.qty_on_hand?.message}
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
                  isRequired
                  type="number"
                  name="qty_reserve"
                  error={errors.qty_reserve?.message}
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
                  options={
                    [].map((item: any) => ({
                      label: item?.main_sku,
                      value: item?.id
                    })) || []
                  }
                  isRequired
                  label="Package rule"
                  name="package_rule"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </Card>

      <Card>
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
                  isRequired
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
                  isRequired
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
      </Card>
    </div>
  );
};

export default FormProduct;
