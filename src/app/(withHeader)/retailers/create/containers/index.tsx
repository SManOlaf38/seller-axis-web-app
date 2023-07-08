'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';

import { useStore } from '@/app/(withHeader)/retailers/context';
import * as actions from '@/app/(withHeader)/retailers/context/action';
import * as services from '@/app/(withHeader)/retailers/fetch';
import { DATA_TYPE, schemaRetailer } from '../../constants';
import { Retailer } from '../../interface';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const NewRetailerContainer = () => {
  const router = useRouter();
  const params = useParams();
  const {
    state: { isLoadingCreate, detailRetailer },
    dispatch
  } = useStore();

  const defaultValues = {
    name: '',
    type: ''
  };

  const {
    control,
    reset,
    setValue,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaRetailer)
  });

  const handleCreateRetailer = async (data: Retailer) => {
    try {
      if (params?.id) {
        dispatch(actions.updateRetailerRequest());
        await services.updateRetailerService(data, params?.id);
        dispatch(actions.updateRetailerSuccess());
        router.push('/retailers');
      } else {
        dispatch(actions.createRetailerRequest());
        await services.createRetailerService(data);
        dispatch(actions.createRetailerSuccess());
        router.push('/retailers');
      }
    } catch (error: any) {
      if (params?.id) {
        dispatch(actions.updateRetailerFailure(error.message));
      } else {
        dispatch(actions.createRetailerFailure(error.message));
      }
    }
  };

  const getDetailRetailer = async () => {
    try {
      dispatch(actions.getDetailRetailerRequest());
      const response = await services.getDetailRetailerService(params?.id);
      dispatch(actions.getDetailRetailerSuccess(response));
    } catch (error: any) {
      dispatch(actions.getDetailRetailerFailure(error.message));
    }
  };

  useEffect(() => {
    params?.id && getDetailRetailer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (detailRetailer) {
      setValue('name', detailRetailer.name);
      setValue('type', detailRetailer.type);
    }
  }, [setValue, reset, detailRetailer]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Create Retailer</h2>
      <form
        noValidate
        onSubmit={handleSubmit(handleCreateRetailer)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <div className="grid w-full grid-cols-1 gap-4">
          <Card>
            <div className="flex w-full flex-col gap-4">
              <div className="w-[50%]">
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

              <div className="w-[50%]">
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={DATA_TYPE}
                      name="type"
                      label="Type"
                      required
                      error={errors.type?.message as string}
                    />
                  )}
                />
              </div>
            </div>
          </Card>
          <div className="mb-2 flex justify-end">
            <Button
              isLoading={isLoadingCreate}
              disabled={isLoadingCreate}
              type="submit"
              className="bg-primary500"
            >
              {params?.id ? 'Update Retailer' : 'Create Retailer'}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default NewRetailerContainer;
