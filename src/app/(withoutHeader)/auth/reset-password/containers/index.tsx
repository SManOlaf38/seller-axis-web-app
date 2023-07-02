'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStore } from '../../context';
import { backSendEmail } from '../../context/action';

export default function ResetPasswordContainer() {
  const {
    state: { isLoading, errorMessage, verifySucceed },
    dispatch,
  } = useStore();

  const handleResetPassword = async () => {};

  const handleBackSendEmail = () => {
    dispatch(backSendEmail());
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="header_cus flex w-[532px] flex-col gap-[40px] rounded-[10px] border custom_header_light dark:header_cus p-[60px] max-sm:mx-4 max-sm:px-[20px]">
        {verifySucceed === 'false' && (
          <div className="flex flex-col items-center justify-center text-center">
            {errorMessage && (
              <p className="mb-2 block text-center text-sm font-medium text-red-800">
                {errorMessage}
              </p>
            )}
          </div>
        )}
        {verifySucceed === 'true' && (
          <>
            <div className="flex flex-col justify-center text-center">
              <h3 className="text-[32px] font-bold leading-[52px]">
                Create new password
              </h3>
              <p className="text-sm font-normal">
                Your new password must be different from previous used
                passwords.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="on"
                />
              </div>
              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirm_password"
                  placeholder="Enter your confirm password"
                  autoComplete="on"
                />
              </div>
              <>
                <Button
                  isLoading={isLoading}
                  className="w-full items-center justify-center bg-dodgerBlue text-center mt-[25px]"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
                {errorMessage && (
                  <p className="mb-2 block text-center text-sm font-medium text-red-800">
                    {errorMessage}
                  </p>
                )}
              </>

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
