'use client';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';

import { schema } from '../schemas';
import { useStoreAccount } from '../context';
import { ContextAccountType } from '../context/type';
import {
  changePasswordFail,
  changePasswordRequest,
  changePasswordSuccess
} from '../context/action';
import { changePasswordService } from '../fetch';

export default function AccountContainer() {
  const { state, dispatch: accountDispatch }: ContextAccountType = useStoreAccount();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const defaultValues = {
    old_password: '',
    new_password: '',
    confirm_password: ''
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      accountDispatch(changePasswordRequest());
      await changePasswordService({
        old_password: data.old_password,
        new_password: data.new_password
      });
      accountDispatch(changePasswordSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Password updated successfully',
          color: 'success',
          title: 'Success'
        })
      );
      reset();
    } catch (error: any) {
      accountDispatch(changePasswordFail());
      dispatchAlert(
        openAlertMessage({
          message: 'Wrong password',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  });

  const onCancel = () => {
    reset();
  };

  return (
    <Card className="p-[16px]">
      <h2 className="mb-[16px] text-lg font-semibold">Change Password</h2>
      <div className="justify-start">
        <form onSubmit={onSubmit} noValidate className="w-full">
          <div className="flex w-full flex-col gap-4">
            <div>
              <Controller
                control={control}
                name="old_password"
                render={({ field }) => (
                  <Input
                    {...field}
                    required
                    label="Password"
                    name="old_password"
                    type="password"
                    placeholder="Enter your password"
                    error={errors.old_password?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="new_password"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="New Password"
                    required
                    name="new_password"
                    type="password"
                    placeholder="Enter your new password"
                    error={errors.new_password?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="confirm_password"
                render={({ field }) => (
                  <Input
                    {...field}
                    required
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    placeholder="Enter your confirm password"
                    error={errors.confirm_password?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className=" mt-[16px] flex justify-end">
            <Button
              disabled={state?.isLoading}
              color="dark:bg-gunmetal bg-buttonLight"
              type="button"
              className="mr-[16px] min-w-[100px] items-center justify-center"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="min-w-[100px] items-center justify-center"
              disabled={state?.isLoading}
              isLoading={state?.isLoading}
              color="bg-primary500"
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
