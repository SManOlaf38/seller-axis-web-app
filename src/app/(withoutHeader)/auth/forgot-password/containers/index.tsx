'use client';

import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import MailIcon from 'public/mail-icon.svg';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';

import { useStore, action } from '../../context';
import { backSendEmail } from '../../context/action';
import { schema } from '../../schemas';
import { forgotPasswordService } from '../../fetch';

const forgotPasswordSchema = schema.pick(['email']);

export default function ForgotPasswordContainer() {
  const {
    state: { isLoading, errorMessage, isChecked },
    dispatch
  } = useStore();

  const defaultValues = {
    email: ''
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

  const handleSendEmail = async (data: { email: string }) => {
    try {
      dispatch(action.forgotPasswordRequest());
      const dataRequest = await forgotPasswordService(data);
      dispatch(action.forgotPasswordSuccess(dataRequest));
    } catch (error: any) {
      dispatch(action.forgotPasswordFail(error.message));
    }
  };

  const handleBackSendEmail = () => {
    dispatch(backSendEmail());
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="header_cus custom_header_light dark:header_cus flex w-[532px] flex-col gap-[40px] rounded-[10px] border p-[60px] max-sm:mx-4 max-sm:px-[20px]">
        {isChecked ? (
          <>
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-[32px] font-bold leading-[52px]">Check your mail</h3>
              <MailIcon />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm font-normal">
                Did not receive the email? {''}
                <Link href={'/auth/login'} className="text-primary500">
                  try another email address
                </Link>
              </p>
              <p className="text-center text-sm font-normal">
                Questions? Email us at {''}
                <span onClick={handleBackSendEmail} className="text-primary500">
                  seller.axis@example.com
                </span>
              </p>
            </div>
          </>
        ) : (
          <form noValidate onSubmit={handleSubmit(handleSendEmail)}>
            <div className="flex flex-col justify-center text-center">
              <h3 className="text-[32px] font-bold leading-[52px]">Reset password</h3>
              <p className="text-sm font-normal">
                Enter the email associated with your account and we’ll send an email with
                instructions to reset your password.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="mt-[40px]">
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      label="Email"
                      required
                      name="email"
                      error={errors.email?.message}
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
                  Send Email
                </Button>
                {errorMessage && (
                  <p className="text-red-800 mb-2 block text-center text-sm font-medium">
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
