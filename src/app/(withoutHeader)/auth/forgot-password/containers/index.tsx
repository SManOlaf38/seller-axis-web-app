'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStore } from '../../context';
import { backSendEmail } from '../../context/action';

export default function ForgotPasswordContainer() {
  const {
    state: { isLoading, errorMessage, isChecked },
    dispatch,
  } = useStore();

  const handleSendEmail = async () => {};

  const handleBackSendEmail = () => {
    dispatch(backSendEmail());
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="header_cus flex w-[532px] flex-col gap-[40px] rounded-[10px] border custom_header_light dark:header_cus p-[60px] max-sm:mx-4 max-sm:px-[20px]">
        {isChecked ? (
          <>
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-[32px] font-bold leading-[52px]">
                Check your mail
              </h3>
              <Image
                src="/mail-icon.svg"
                width={109}
                height={109}
                alt="Email"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm font-normal">
                Did not receive the email? {''}
                <Link href={'/auth/login'} className="text-dodgerBlue">
                  try another email address
                </Link>
              </p>
              <p className="text-center text-sm font-normal">
                Questions? Email us at {''}
                <span onClick={handleBackSendEmail} className="text-dodgerBlue">
                  seller.axis@example.com
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center text-center">
              <h3 className="text-[32px] font-bold leading-[52px]">
                Reset password
              </h3>
              <p className="text-sm font-normal">
                Enter the email associated with your account and we’ll send an
                email with instructions to reset your password.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                />
              </div>
              <>
                <Button
                  isLoading={isLoading}
                  className="w-full items-center justify-center bg-dodgerBlue text-center mt-[25px]"
                  onClick={handleSendEmail}
                >
                  Next
                </Button>
                {errorMessage && (
                  <p className="mb-2 block text-center text-sm font-medium text-red-800">
                    {errorMessage}
                  </p>
                )}
              </>
              <p className="text-center text-sm font-normal">
                Do you already have an account? {''}
                <Link href={'/auth/login'} className="text-dodgerBlue">
                  Login
                </Link>
              </p>
              <p className="text-center text-sm font-normal">
                Questions? Email us at {''}
                <Link
                  href="mailto: seller.axis@example.com"
                  className="text-dodgerBlue"
                >
                  seller.axis@example.com
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
