'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { Radius } from '@/components/ui/Radius';

import { schemaBarcodeSize } from '../../constants';
import { FormCreateBarcodeSize } from '../../interface';
import { useStoreBarcodeSize } from '../../context';
import {
  createBarcodeSizeFailure,
  createBarcodeSizeRequest,
  createBarcodeSizeSuccess,
  getDetailBarcodeSizeFailure,
  getDetailBarcodeSizeRequest,
  getDetailBarcodeSizeSuccess,
  updateBarcodeSizeFailure,
  updateBarcodeSizeRequest,
  updateBarcodeSizeSuccess
} from '../../context/action';
import {
  createBarcodeSizeService,
  getDetailBarcodeSizeService,
  updateBarcodeSizeService
} from '../../fetch';

const NewBarcodeSizeContainer = () => {
  const params = useParams();
  const router = useRouter();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const {
    state: { errorMessage, isLoadingCreate, detailBarcodeSize },
    dispatch: BarcodeSizeDispatch
  } = useStoreBarcodeSize();

  const defaultValues = useMemo(() => {
    return {
      name: '',
      width: 0,
      height: 0,
      multiple_per_label: true
    };
  }, []);

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaBarcodeSize)
  });

  const handleCreateBarcodeSize = async (data: FormCreateBarcodeSize) => {
    try {
      if (params?.id) {
        BarcodeSizeDispatch(updateBarcodeSizeRequest());
        await updateBarcodeSizeService(
          {
            ...data
          },
          +params?.id
        );
        BarcodeSizeDispatch(updateBarcodeSizeSuccess());
        router.push('/barcode-size');
      } else {
        BarcodeSizeDispatch(createBarcodeSizeRequest());
        await createBarcodeSizeService({
          ...data
        });
        BarcodeSizeDispatch(createBarcodeSizeSuccess());
        router.push('/barcode-size');
      }
    } catch (error: any) {
      if (params?.id) {
        BarcodeSizeDispatch(updateBarcodeSizeFailure(error.message));
      } else {
        BarcodeSizeDispatch(createBarcodeSizeFailure(error.message));
        dispatchAlert(
          openAlertMessage({
            message: errorMessage,
            color: 'error',
            title: 'Fail'
          })
        );
      }
    }
  };

  const getDetailBarcodeSize = async () => {
    try {
      BarcodeSizeDispatch(getDetailBarcodeSizeRequest());
      const response = await getDetailBarcodeSizeService(+params?.id);
      BarcodeSizeDispatch(getDetailBarcodeSizeSuccess(response));
    } catch (error: any) {
      BarcodeSizeDispatch(getDetailBarcodeSizeFailure(error.message));
    }
  };

  useEffect(() => {
    params?.id && getDetailBarcodeSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (detailBarcodeSize) {
      Object?.keys(detailBarcodeSize)?.forEach((key) => {
        setValue(key, detailBarcodeSize[key]);
      });
    }
  }, [setValue, detailBarcodeSize]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {params?.id ? 'Update Barcode Size' : 'Create Barcode Size'}
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit(handleCreateBarcodeSize)}
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
                      placeholder="Enter name barcode size"
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
              <Controller
                control={control}
                name="multiple_per_label"
                render={({ field }) => (
                  <Radius
                    checked={field.value}
                    {...field}
                    label="Multiple per label"
                    name="multiple_per_label"
                  />
                )}
              />
            </div>
          </Card>

          <div className="mb-2 flex flex-col items-end">
            <Button
              type="submit"
              isLoading={isLoadingCreate}
              disabled={isLoadingCreate}
              className="bg-primary500"
            >
              {params?.id ? 'Update Barcode Size' : 'Create Barcode Size'}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default NewBarcodeSizeContainer;
