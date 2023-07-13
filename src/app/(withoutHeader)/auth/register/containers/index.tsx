'use client';

import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import omit from 'lodash/omit';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { action, useStore } from '../../context';
import { registerService } from '../../fetch';
import { schema } from '../../schemas';

export default function RegisterContainer() {
  const router = useRouter();

  const {
    state: { isLoading, errorMessage },
    dispatch,
  } = useStore();
  const method = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    resolver: yupResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = method;

  const onSubmit = handleSubmit(async (data) => {
    const body = omit(data, ['confirm_password']);
    try {
      dispatch(action.registerRequest());
      const data = await registerService(body);
      dispatch(action.registerSuccess(data));
      router.push('/auth/login');
    } catch (error: any) {
      dispatch(action.registerFail(error));
    }
  });

  return (
    <div className="flex h-full items-center justify-center">
      <div className="header_cus flex w-[532px] flex-col gap-[40px] rounded-[10px] border custom_header_light dark:header_cus px-[60px] py-[30px] max-sm:mx-4 max-sm:px-[20px]">
        <div className="flex flex-col justify-center text-center">
          <h3 className="text-[32px] font-bold leading-[52px]">
            Welcome to Seller Axis
          </h3>
          <p className="text-sm font-normal">
            You only need to perform a simple action to sign up to your account
            and access Seller Axis.
          </p>
        </div>
        <FormProvider {...method}>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <div>
              <Input
                register={register}
                label="First name"
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                autoComplete="on"
              />
            </div>
            <div>
              <Input
                register={register}
                label="Last name"
                type="text"
                name="last_name"
                placeholder="Enter your last name"
                autoComplete="on"
              />
            </div>
            <div>
              <Input
                register={register}
                error={errors.email?.message}
                required
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Input
                register={register}
                error={errors.password?.message}
                required
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="on"
              />
            </div>
            <div>
              <Input
                register={register}
                error={errors.confirm_password?.message}
                required
                label="Confirm Password"
                type="password"
                name="confirm_password"
                placeholder="Enter your confirm password"
                autoComplete="on"
              />
            </div>
            <>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                color='bg-primary500'
                className="w-full items-center justify-center text-center mt-[25px]"
              >
                Sign Up
              </Button>
              {errorMessage && (
                <p className="mb-2 block text-center text-sm font-medium text-red">
                  {errorMessage}
                </p>
              )}
            </>
            <p className="text-center text-sm font-normal">
              Do you already have an account? {''}
              <Link href={'/auth/login'} className="text-primary500">
                Login
              </Link>
            </p>
            <p className="text-center text-sm font-normal">
              Questions? Email us at {''}
              <Link
                href="mailto: seller.axis@example.com"
                className="text-primary500"
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
