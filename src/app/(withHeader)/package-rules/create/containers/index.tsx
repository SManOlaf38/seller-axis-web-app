'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore } from '@/app/(withHeader)/package-rules/context';
import * as actions from '@/app/(withHeader)/package-rules/context/action';
import * as services from '@/app/(withHeader)/package-rules/fetch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaPackageRule } from '../../constants';
import FormPackageRule from '../components/FormPackageRule';
import { PackageRule } from '../../interface';

const NewPackageRule = () => {
  const params = useParams();
  const {
    state: { isLoading, detailPackageRule },
    dispatch
  } = useStore();

  const router = useRouter();

  const defaultValues = useMemo(() => {
    return {
      name: '',
      wight: '',
      height: '',
      length: '',
      dimension_unit: ''
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
    resolver: yupResolver<any>(schemaPackageRule)
  });

  const handleCreatePackageRule = async (data: PackageRule) => {
    try {
      if (params?.id) {
        dispatch(actions.updatePackageRuleRequest());
        await services.updatePackageRuleService(data, params?.id);
        dispatch(actions.updatePackageRuleSuccess());
        router.push('/package-rules');
      } else {
        dispatch(actions.createPackageRuleRequest());
        await services.createPackageRuleService(data);
        router.push('/package-rules');
        dispatch(actions.createPackageRuleSuccess());
      }
    } catch (error: any) {
      if (params?.id) {
        dispatch(actions.updatePackageRuleFailure(error.message));
      } else {
        dispatch(actions.createPackageRuleFailure(error.message));
      }
    }
  };

  const getDetailRetailer = async () => {
    try {
      dispatch(actions.getDetailPackageRuleRequest());
      const response = await services.getDetailPackageRuleService(params?.id);
      dispatch(actions.getDetailPackageRuleSuccess(response));
    } catch (error: any) {
      dispatch(actions.getDetailPackageRuleFailure(error.message));
    }
  };

  useEffect(() => {
    params?.id && getDetailRetailer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (detailPackageRule) {
      Object?.keys(detailPackageRule)?.forEach((key) => {
        setValue(key, detailPackageRule[key]);
      });
    }
  }, [setValue, detailPackageRule]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {params?.id ? 'Update Package Rule' : 'Create Package Rule'}
      </h2>

      <form
        noValidate
        onSubmit={handleSubmit(handleCreatePackageRule)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormPackageRule
          errors={errors}
          isLoading={isLoading}
          control={control}
          params={params?.id}
        />
      </form>
    </main>
  );
};

export default NewPackageRule;
