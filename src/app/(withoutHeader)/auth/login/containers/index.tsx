'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStore } from '../context';

export default function LoginContainer() {
  const { state: {
    isLoading,
    errorMessage
  }, dispatch } = useStore();

  const handleLogin = async () => {};

  return (
    <div className="flex h-full items-center justify-center">
      <div className="header_cus flex w-[532px] flex-col gap-[40px] rounded-[10px] border bg-gunmetal p-[60px] max-sm:mx-4 max-sm:px-[20px]">
        <div className="flex flex-col justify-center text-center">
          <h3 className="text-[32px] font-bold leading-[52px]">
            Welcome to SellerAxis
          </h3>
          <p className="text-sm font-normal">
            You only need to perform a simple action to log in to your account
            and access SellerAxis.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Input label='User name' />
          </div>
          <div>
            <Input label='Password' />
          </div>
          <>
            <Button
              isLoading={isLoading}
              className="w-full items-center justify-center bg-dodgerBlue text-center"
              onClick={handleLogin}
            >
              Login
            </Button>
            {errorMessage && (
              <p className="mb-2 block text-center text-sm font-medium text-red-800">
                {errorMessage}
              </p>
            )}
          </>
          <p className="text-center text-sm font-normal">
            Questions? Email us at{' '}
            <Link
              href="mailto: traceninja@example.com"
              className="text-dodgerBlue"
            >
              sellerAxis@example.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
