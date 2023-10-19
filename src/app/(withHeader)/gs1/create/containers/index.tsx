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

import { schemaGs1 } from '../../constants';
import { CreateGs1Type } from '../../interface';
import { useStoreGs1 } from '../../context';
import {
  createGs1Failure,
  createGs1Request,
  createGs1Success,
  getDetailGs1Failure,
  getDetailGs1Request,
  getDetailGs1Success,
  updateGs1Failure,
  updateGs1Request,
  updateGs1Success
} from '../../context/action';
import { createGs1Service, getDetailGs1Service, updateGs1Service } from '../../fetch';

const NewGs1Container = () => {
  const params = useParams();
  const router = useRouter();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const {
    state: { errorMessage, isLoadingCreate, detailGs1 },
    dispatch: Gs1Dispatch
  } = useStoreGs1();

  const defaultValues = useMemo(() => {
    return {
      name: '',
      gs1: ''
    };
  }, []);

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaGs1)
  });

  const handleCreateGs1 = async (data: CreateGs1Type) => {
    try {
      if (params?.id) {
        Gs1Dispatch(updateGs1Request());
        await updateGs1Service(
          {
            ...data
          },
          +params?.id
        );
        Gs1Dispatch(updateGs1Success());
        router.push('/gs1');
      } else {
        Gs1Dispatch(createGs1Request());
        await createGs1Service({
          ...data
        });
        Gs1Dispatch(createGs1Success());
        router.push('/gs1');
      }
    } catch (error: any) {
      if (params?.id) {
        Gs1Dispatch(updateGs1Failure(error.message));
        dispatchAlert(
          openAlertMessage({
            message: error.message || 'Update Gs1 Fail',
            color: 'error',
            title: 'Fail'
          })
        );
      } else {
        Gs1Dispatch(createGs1Failure(error.message));
        dispatchAlert(
          openAlertMessage({
            message: error.message || 'Create Gs1 Fail',
            color: 'error',
            title: 'Fail'
          })
        );
      }
    }
  };

  const getDetailGs1 = async () => {
    try {
      Gs1Dispatch(getDetailGs1Request());
      const response = await getDetailGs1Service(+params?.id);
      Gs1Dispatch(getDetailGs1Success(response));
    } catch (error: any) {
      Gs1Dispatch(getDetailGs1Failure(error.message));
    }
  };

  useEffect(() => {
    params?.id && getDetailGs1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (detailGs1) {
      reset({
        ...detailGs1
      });
    }
  }, [detailGs1, reset]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">{params?.id ? 'Update GS1' : 'Create GS1'}</h2>
      <form
        noValidate
        onSubmit={handleSubmit(handleCreateGs1)}
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
                      placeholder="Enter name GS1"
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
                  name="gs1"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter GS1"
                      label="GS1"
                      required
                      name="gs1"
                      error={errors.gs1?.message}
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
              {params?.id ? 'Update GS1' : 'Create GS1'}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default NewGs1Container;
