'use client';

import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { useStore, action } from '../../context';
import { VerifyEmail } from '../../interfaces';
import { schema } from '../../schemas';
import { changePasswordService } from '../../fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

const forgotPasswordSchema = schema.pick(['password', 'confirm_password']);

export default function ResetPasswordContainer() {
  const { dispatch: dispatchAlert } = useStoreAlert();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    state: { isLoading, errorMessage, verifySucceed },
    dispatch
  } = useStore();
  const secret = searchParams?.get('secret');
  const userId = searchParams?.get('user');

  const defaultValues = {
    password: '',
    confirm_password: ''
  };

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(forgotPasswordSchema)
  });

  const handleChangePassword = async (data: VerifyEmail) => {
    try {
      if (secret && userId) {
        dispatch(action.forgotPasswordRequest());
        const dataRequest = await changePasswordService({
          id: +userId,
          secret: secret,
          password: data.password
        });
        dispatch(action.forgotPasswordSuccess(dataRequest));
        dispatchAlert(
          openAlertMessage({
            message: 'Password reset successful',
            color: 'success',
            title: 'Success'
          })
        );
        router.push('/auth/login');
      }
    } catch (error: any) {
      dispatch(action.forgotPasswordFail(error.message));
      dispatchAlert(
        openAlertMessage({
          message: 'Password reset error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    if (secret && userId) {
      dispatch(action.verifyEmailSuccess({ secret, userId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="header_cus custom_header_light dark:header_cus flex w-[532px] flex-col gap-[40px] rounded-[10px] border p-[60px] max-sm:mx-4 max-sm:px-[20px]">
        {verifySucceed === 'true' && (
          <form noValidate onSubmit={handleSubmit(handleChangePassword)}>
            <div className="flex flex-col justify-center text-center">
              <h3 className="text-[32px] font-bold leading-[52px]">Create new password</h3>
              <p className="text-sm font-normal">
                Your new password must be different from previous used passwords.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      label="Password"
                      required
                      name="password"
                      error={errors.password?.message}
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
                      type="password"
                      placeholder="Enter your confirm password"
                      label="Confirm password"
                      required
                      name="confirm_password"
                      error={errors.confirm_password?.message}
                    />
                  )}
                />
              </div>
              <>
                <Button
                  isLoading={isLoading}
                  disabled={isLoading}
                  color="bg-primary500"
                  className="mt-[25px] w-full items-center justify-center text-center"
                  type="submit"
                >
                  Reset Password
                </Button>
                {errorMessage && (
                  <p className="text-red-800 mb-2 block text-center text-sm font-medium">
                    {errorMessage}
                  </p>
                )}
              </>

              <p className="text-center text-sm font-normal">
                Questions? Email us at {''}
                <Link href="mailto: seller.axis@example.com" className="text-primary500">
                  seller.axis@example.com
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
