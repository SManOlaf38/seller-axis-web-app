'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore } from '@/app/(withHeader)/package-rules/context';
import * as actions from '@/app/(withHeader)/package-rules/context/action';
import * as services from '@/app/(withHeader)/package-rules/fetch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaPackageRule } from '../../constants';
import FormPackageRule from '../components/FormPackageRule';
import { PackageRule } from '../../interface';

const NewPackageRule = () => {
  const {
    state: { isLoading },
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
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaPackageRule)
  });

  const handleCreateProduct = async (data: PackageRule) => {
    try {
      dispatch(actions.createPackageRuleRequest());

      await services.createPackageRuleService(data);
      router.push('/package-rules');
      dispatch(actions.createPackageRuleSuccess());
    } catch (error: any) {
      dispatch(actions.createPackageRuleFailure(error.message));
    }
  };

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Create Package Rule</h2>

      <form
        noValidate
        onSubmit={handleSubmit(handleCreateProduct)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormPackageRule errors={errors} isLoading={isLoading} control={control} />
      </form>
    </main>
  );
};

export default NewPackageRule;
