'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import IconEdit from 'public/edit.svg';
import IconRevert from 'public/revert.svg';
import type { Customer, Order, ShipTo, UpdateShipTo } from '../../../interface';
import { InfoOrder } from '../../containers';
import { schemaShipTo } from '../ConfigureShipment';

const Recipient = ({
  shipTo,
  customer,
  billTo,
  onVerifyAddress,
  isLoadingVerify,
  detail,
  onRevertAddress,
  onUpdateShipTo,
  isLoadingUpdateShipTo
}: {
  shipTo: ShipTo | null;
  customer: Customer | null;
  billTo: ShipTo | null;
  onVerifyAddress: () => Promise<void>;
  isLoadingVerify: boolean;
  detail: Order;
  onRevertAddress: () => Promise<void>;
  onUpdateShipTo: (data: UpdateShipTo) => Promise<void>;
  isLoadingUpdateShipTo: boolean;
}) => {
  const [isEditRecipient, setIsEditRecipient] = useState(false);

  const handleToggle = () => {
    setIsEditRecipient((isEditRecipient) => !isEditRecipient);
  };

  const handleCancel = (event: React.MouseEvent<{}, MouseEvent>) => {
    event.preventDefault();
    setIsEditRecipient(false);
  };

  const defaultValues = useMemo(() => {
    if (detail) {
      return {
        company: detail.verified_ship_to?.company || detail.ship_to?.company || '',
        address_1: detail.verified_ship_to?.address_1 || detail.ship_to?.address_1 || '',
        address_2: detail.verified_ship_to?.address_2 || detail.ship_to?.address_2 || '',
        city: detail.verified_ship_to?.city || detail.ship_to?.city || '',
        country: detail.verified_ship_to?.country || detail.ship_to?.country || '',
        day_phone: detail.verified_ship_to?.day_phone || detail.ship_to?.day_phone || '',
        email: detail.verified_ship_to?.email || detail.ship_to?.email || '',
        name: detail.verified_ship_to?.name || detail.ship_to?.name || '',
        postal_code: detail.verified_ship_to?.postal_code || detail.ship_to?.postal_code || '',
        state: detail.verified_ship_to?.state || detail.ship_to?.state || '',

        companyFrom: detail.ship_from?.company || '',
        addressFrom: detail.ship_from?.address || '',
        cityFrom: detail.ship_from?.city || '',
        countryFrom: detail.ship_from?.country || '',
        phoneFrom: detail.ship_from?.day_phone || '',
        postal_codeFrom: detail.ship_from?.postal_code || '',
        nameFrom: detail.ship_from?.name || '',
        stateFrom: detail.ship_from?.state || ''
      };
    }
  }, [detail]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaShipTo)
  });

  const handleSubmitData = (data: UpdateShipTo) => {
    onUpdateShipTo({
      ...data,
      callback: () => handleToggle()
    });
  };

  return (
    <CardToggle title="Recipient" className="grid w-full grid-cols-1 gap-2">
      <form
        noValidate
        onSubmit={handleSubmit(handleSubmitData)}
        className="grid w-full grid-cols-1 gap-2"
      >
        <div className="grid w-full grid-cols-1 justify-between gap-2 lg:grid-cols-2">
          <InfoOrder
            classNameBorder="border-none"
            className="mt-4 rounded-lg border border-lightLine p-4 dark:border-iridium"
            title={'Ship From'}
            value={
              isEditRecipient ? (
                <div className="my-2">
                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="nameFrom"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Name"
                          name="nameFrom"
                          error={errors.nameFrom?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="companyFrom"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Company"
                          name="companyFrom"
                          error={errors.companyFrom?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="addressFrom"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Address"
                          name="addressFrom"
                          error={errors.addressFrom?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="cityFrom"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="City"
                          name="cityFrom"
                          error={errors.cityFrom?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="stateFrom"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="State"
                          name="stateFrom"
                          error={errors.stateFrom?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="postal_codeFrom"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Postal code"
                          name="postal_codeFrom"
                          error={errors.postal_codeFrom?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="countryFrom"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Country"
                          name="countryFrom"
                          error={errors.countryFrom?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="phoneFrom"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Phone number"
                          name="phoneFrom"
                          error={errors.phoneFrom?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Company:</p>
                    <p className="font-normal">{detail.ship_from?.company || '-'}</p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Contact Name:</p>
                    <p className="font-normal">{detail.ship_from?.name || '-'}</p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Address:</p>
                    <p className="font-normal">{detail.ship_from?.address || '-'}</p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">City:</p>
                    <p className="font-normal">{detail.ship_from?.city || '-'}</p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">State:</p>
                    <p className="font-normal">{detail.ship_from?.state || '-'}</p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Postal Code:</p>
                    <p className="font-normal">{detail.ship_from?.postal_code || '-'}</p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Country:</p>
                    <p className="font-normal">{detail.ship_from?.country || '-'}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Phone:</p>
                    <p className="font-normal">{detail.ship_from?.day_phone || '-'}</p>
                  </div>
                </div>
              )
            }
            content={<div className="h-[32px]" />}
          />

          <InfoOrder
            classNameBorder="border-none"
            className="mt-4 rounded-lg border border-lightLine p-4 dark:border-iridium"
            title={'Ship To'}
            value={
              isEditRecipient ? (
                <div className="my-2">
                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Name"
                          required
                          name="name"
                          error={errors.name?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="company"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Company"
                          name="company"
                          error={errors.company?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Email"
                          name="email"
                          error={errors.email?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="address_1"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Address 1"
                          required
                          name="address_1"
                          error={errors.address_1?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="address_2"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Address 2"
                          name="address_2"
                          error={errors.address_2?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="City"
                          required
                          name="city"
                          error={errors.city?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="state"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="State"
                          required
                          name="state"
                          error={errors.state?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="postal_code"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Postal code"
                          required
                          name="postal_code"
                          error={errors.postal_code?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Country"
                          required
                          name="country"
                          error={errors.country?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="day_phone"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Phone number"
                          required
                          name="day_phone"
                          error={errors.day_phone?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Company:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.company || detail.ship_to?.company || '-'}
                    </p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Contact Name:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.name || detail.ship_to?.name || '-'}
                    </p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Address 1:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.address_1 || detail.ship_to?.address_1 || '-'}
                    </p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Address 2:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.address_2 || detail.ship_to?.address_2 || '-'}
                    </p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">City:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.city || detail.ship_to?.city || '-'}
                    </p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">State:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.state || detail.ship_to?.state || '-'}
                    </p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Postal Code:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.postal_code || detail.ship_to?.postal_code || '-'}
                    </p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Country:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.country || detail.ship_to?.country || '-'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Phone:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.day_phone || detail.ship_to?.day_phone || '-'}
                    </p>
                  </div>
                </div>
              )
            }
            content={
              <div className="flex items-center justify-end gap-4">
                {isEditRecipient ? (
                  <>
                    <Button
                      type="button"
                      onClick={(event) => handleCancel(event)}
                      className="bg-gey100 dark:bg-gunmetal"
                    >
                      Cancel
                    </Button>
                    <Button
                      isLoading={isLoadingUpdateShipTo}
                      disabled={isLoadingUpdateShipTo}
                      type="submit"
                      className="bg-primary500"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    {detail?.verified_ship_to?.id ? (
                      <span className="text-sm text-[#6CFF8D]"> Address Validated</span>
                    ) : (
                      <Button
                        onClick={onVerifyAddress}
                        className="bg-gey100 dark:bg-gunmetal"
                        isLoading={isLoadingVerify}
                        disabled={isLoadingVerify}
                      >
                        Verify Address
                      </Button>
                    )}
                    {detail?.verified_ship_to?.id && (
                      <Button
                        onClick={onRevertAddress}
                        color="bg-primary500"
                        isLoading={isLoadingVerify}
                        disabled={isLoadingVerify}
                        startIcon={<IconRevert />}
                      >
                        Revert
                      </Button>
                    )}
                    <Button
                      onClick={handleToggle}
                      className="bg-gey100 dark:bg-gunmetal"
                      startIcon={<IconEdit />}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            }
          />
        </div>
      </form>
    </CardToggle>
  );
};

export default Recipient;
