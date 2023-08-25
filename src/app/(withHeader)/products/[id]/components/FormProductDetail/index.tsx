'use client';

import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormSetError,
  UseFormSetValue
} from 'react-hook-form';

import { UploadImageCom } from '@/components/common/UploadImage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { ChangeEvent } from 'react';
import { DATA_AVAILABLE, DATA_UNI_OF_MEASURES, DATA_WEIGH_UNIT } from '../../../constants';
import type { PackageRule } from '../../../interface';
import Autocomplete from '@/components/ui/Autocomplete';

interface FormProductProps {
  image: string;
  onChangeImage: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDeleteImage: () => void;
  errors: FieldErrors<any>;
  control: Control<any, any>;
  isLoading: boolean;
  packageRules: PackageRule[];
  onGetPackageRule: () => Promise<void>;
  onSubmitData: UseFormHandleSubmit<any, undefined>;
  setError: UseFormSetError<any>;
  setValue: UseFormSetValue<any>;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  dataProductSeries: any[];
  onGetProductSeries: () => void;
}

const FormProductDetail = ({
  image,
  onChangeImage,
  onDeleteImage,
  errors,
  control,
  isLoading,
  setError,
  setValue,
  handleSearch,
  dataProductSeries,
  onGetProductSeries
}: FormProductProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <UploadImageCom
            label="Product Picture"
            image={image}
            onChangeImage={(e) => {
              onChangeImage(e);
              setValue('image', 'image');
            }}
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
              name="product_series"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    dataProductSeries?.map((item: any) => ({
                      label: item?.series,
                      value: item?.id
                    })) || []
                  }
                  handleChangeText={handleSearch}
                  required
                  label="Product series"
                  name="product_series"
                  placeholder="Select Product series"
                  onReload={onGetProductSeries}
                  pathRedirect="/product-series/create"
                  error={errors.product_series?.message}
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
                  label="QTY reserve"
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
              name="qty_pending"
              render={({ field }) => (
                <Input
                  {...field}
                  label="QTY pending"
                  required
                  type="number"
                  name="qty_pending"
                  placeholder="0"
                  error={errors.qty_pending?.message}
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
                  label="QTY on hand"
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
              name="weight"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Weight"
                  required
                  type="number"
                  placeholder="0"
                  name="weight"
                  error={errors.weight?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="weight_unit"
              render={({ field }) => (
                <Select
                  {...field}
                  required
                  label="Weight unit"
                  options={DATA_WEIGH_UNIT}
                  name="weight_unit"
                  error={errors.weight_unit?.message?.toString()}
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
              name="qbo_product_id"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Quickbook item ID"
                  label="Quickbook item ID"
                  name="qbo_product_id"
                  error={errors.qbo_product_id?.message}
                />
              )}
            />
          </div>
        </div>
      </Card>

      <div className="mb-2 flex justify-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-primary500">
          Update Product
        </Button>
      </div>
    </div>
  );
};

export default FormProductDetail;
