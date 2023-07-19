'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DATA_Dimension_Unit } from '@/app/(withHeader)/package-rules/constants';
import useSearch from '@/hooks/useSearch';
import usePagination from '@/hooks/usePagination';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Autocomplete from '@/components/ui/Autocomplete';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

import { schemaBox } from '../../constants';
import { FormCreateBox } from '../../interface';
import { useStoreBox } from '../../context';
import {
  createBoxFailure,
  createBoxRequest,
  createBoxSuccess,
  getBarcodeSizeFailure,
  getBarcodeSizeRequest,
  getBarcodeSizeSuccess
} from '../../context/action';
import { createBoxService, getBarcodeSizeService } from '../../fetch';

const NewBoxContainer = () => {
  const router = useRouter();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { debouncedSearchTerm, handleSearch } = useSearch();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const {
    state: { errorMessage, barcodeSize, isLoadingCreate },
    dispatch: boxDispatch
  } = useStoreBox();

  const defaultValues = useMemo(() => {
    return {
      name: '',
      length: 0,
      width: 0,
      height: 0,
      dimension_unit: '',
      max_quantity: 0,
      barcode_size: null
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaBox)
  });

  const handleCreateBox = async (data: FormCreateBox) => {
    try {
      boxDispatch(createBoxRequest());
      await createBoxService({
        ...data,
        barcode_size: +data.barcode_size.value
      });
      boxDispatch(createBoxSuccess());
      router.push('/box');
    } catch (error: any) {
      boxDispatch(createBoxFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: errorMessage,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetBarcodeSize = useCallback(async () => {
    try {
      boxDispatch(getBarcodeSizeRequest());
      const data = await getBarcodeSizeService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      boxDispatch(getBarcodeSizeSuccess(data?.results));
    } catch (error: any) {
      boxDispatch(getBarcodeSizeFailure(error.message));
    }
  }, [boxDispatch, debouncedSearchTerm, page, rowsPerPage]);

  useEffect(() => {
    handleGetBarcodeSize();
  }, [handleGetBarcodeSize]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Create Box</h2>
      <form
        noValidate
        onSubmit={handleSubmit(handleCreateBox)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <div className="grid w-full grid-cols-1 gap-4">
          <Card>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
              <div className="w-[50%]">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter name box"
                      label="Name"
                      required
                      name="name"
                      error={errors.name?.message}
                    />
                  )}
                />
              </div>
              <div className="w-[50%]">
                <Controller
                  control={control}
                  name="length"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Length"
                      required
                      type="number"
                      name="length"
                      placeholder="0"
                      error={errors.length?.message}
                    />
                  )}
                />
              </div>
              <div className="w-[50%]">
                <Controller
                  control={control}
                  name="width"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Width"
                      required
                      type="number"
                      placeholder="0"
                      name="width"
                      error={errors.width?.message}
                    />
                  )}
                />
              </div>
              <div className="w-[50%]">
                <Controller
                  control={control}
                  name="height"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Height"
                      required
                      type="number"
                      placeholder="0"
                      name="height"
                      error={errors.height?.message}
                    />
                  )}
                />
              </div>
              <div className="w-[50%]">
                <Controller
                  control={control}
                  name="dimension_unit"
                  render={({ field }) => (
                    <Select
                      {...field}
                      required
                      label="Dimension unit"
                      options={DATA_Dimension_Unit}
                      name="dimension_unit"
                      error={errors.dimension_unit?.message?.toString()}
                    />
                  )}
                />
              </div>
              <div className="w-[50%]">
                <Controller
                  control={control}
                  name="max_quantity"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Max quantity"
                      required
                      type="number"
                      placeholder="0"
                      name="max_quantity"
                      error={errors.max_quantity?.message}
                    />
                  )}
                />
              </div>
              <div className="w-[50%]">
                <Controller
                  control={control}
                  name="barcode_size"
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={
                        barcodeSize?.map((item) => ({
                          value: item?.id,
                          label: item?.name
                        })) || []
                      }
                      handleChangeText={handleSearch}
                      required
                      label="Barcode size"
                      name="barcode_size"
                      placeholder="Select barcode size"
                      onReload={handleGetBarcodeSize}
                      pathRedirect="/barcode-size/create"
                      error={errors.barcode_size?.message}
                    />
                  )}
                />
              </div>
            </div>
          </Card>

          <div className="mb-2 flex flex-col items-end">
            <Button
              type="submit"
              isLoading={isLoadingCreate}
              disabled={isLoadingCreate}
              className="bg-primary500"
            >
              Create Box
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default NewBoxContainer;
