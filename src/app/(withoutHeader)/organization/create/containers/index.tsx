'use client';

import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStore } from '@/app/(withHeader)/organizations/context';
import * as action from '@/app/(withHeader)/organizations/context/action';
import * as service from '@/app/(withHeader)/organizations/fetch';

const schema = yup.object().shape({
  name: yup.string().required('Name is required')
});

export default function CreateOrganization() {
  const router = useRouter();

  const {
    state: { isLoading, errorMessage },
    dispatch
  } = useStore();

  const method = useForm({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(schema)
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = method;

  const onSubmit = handleSubmit(async (body) => {
    try {
      dispatch(action.createOrganizationRequest());
      const response = await service.createOrganizationService(body);
      dispatch(action.createOrganizationSuccess(response));
      Cookies.set('current_organizations', response?.id);
      router.push(`/organizations/${response?.id}/settings`);
    } catch (error: any) {
      dispatch(action.createOrganizationFail(error.detail));
    }
  });

  return (
    <div className="flex h-full items-center justify-center">
      <div className="header_cus custom_header_light dark:header_cus flex w-[532px] flex-col gap-[40px] rounded-[10px] border bg-paperLight p-[60px] dark:bg-darkGreen max-sm:mx-4 max-sm:px-[20px]">
        <div className="flex flex-col justify-center gap-[40px] text-center">
          <h3 className="text-[32px] font-bold leading-[50px]">Create your first organization</h3>
          <p className="text-[14px] font-normal leading-[16px]">
            Please enter your organization name to start your journey with Seller Axis.
          </p>
        </div>
        <FormProvider {...method}>
          <form className="flex flex-col gap-[24px]" onSubmit={onSubmit} noValidate>
            <div>
              <Input
                register={register}
                required
                error={errors.name?.message}
                name="name"
                type="text"
                label="Organization name"
                placeholder="Enter your organization name"
              />
            </div>
            <>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full items-center justify-center bg-primary500 text-center"
              >
                Create your new organization
              </Button>
              {errorMessage && (
                <p className="text-red-800 mb-2 block text-center text-sm font-medium">
                  {errorMessage}
                </p>
              )}
            </>

            <p className="text-center text-[14px] font-normal leading-[16px]">
              Questions? Email us at&nbsp;
              <Link
                href="mailto: seller.axis@example.com"
                className="text-[14px] font-[500] text-primary500"
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
