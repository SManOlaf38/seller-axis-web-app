'use client';

import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { action, useStore } from '../../context';
import { schema } from '../../schemas';
import { loginService } from '../../fetch';

const loginSchema = schema.pick(['email', 'password']);

export default function LoginContainer() {
  const router = useRouter();

  const {
    state: { isLoading, errorMessage },
    dispatch,
  } = useStore();

  const method = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = method;

  const onSubmit = handleSubmit(async (data) => {
    try {
      dispatch(action.loginRequest());
      const dataRequest = await loginService(data);
      dispatch(action.loginSuccess(dataRequest));
      Cookies.set('token', JSON.stringify(dataRequest.access));
      router.push('/');
    } catch (error: any) {
      dispatch(action.loginFail(error.Message));
    }
  });

  return (
    <div className="flex h-full items-center justify-center">
      <div className="header_cus flex w-[532px] flex-col gap-[40px] rounded-[10px] border bg-gunmetal p-[60px] max-sm:mx-4 max-sm:px-[20px]">
        <div className="flex flex-col justify-center text-center">
          <h3 className="text-[32px] font-bold leading-[52px]">
            Welcome to Seller Axis
          </h3>
          <p className="text-sm font-normal">
            You only need to perform a simple action to log in to your account
            and access Seller Axis.
          </p>
        </div>
        <FormProvider {...method}>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <div>
              <Input
                register={register}
                isRequired={true}
                error={errors.email?.message}
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Input
                register={register}
                isRequired={true}
                error={errors.password?.message}
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="on"
              />
            </div>
            <>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full items-center justify-center bg-dodgerBlue text-center"
              >
                Login
              </Button>
              {errorMessage && (
                <p className="mb-2 block text-center text-sm font-medium text-red-800">
                  {errorMessage}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Link
                  href={'/auth/forgot-password'}
                  className="text-sm text-dodgerBlue"
                >
                  Forgot Password?
                </Link>
              </div>
            </>
            <p className="text-center text-sm font-normal">
              Do not have an account? {''}
              <Link href={'/auth/register'} className="text-dodgerBlue">
                Sign Up
              </Link>
            </p>

            <p className="text-center text-sm font-normal">
              Questions? Email us at{' '}
              <Link
                href="mailto: seller.axis@example.com"
                className="text-dodgerBlue"
              >
                seller.axis@example.com
              </Link>
            </p>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
