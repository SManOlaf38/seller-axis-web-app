'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import * as actions from '@/app/(withHeader)/orders/context/action';
import { useStore } from '@/app/(withHeader)/orders/context';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import IconEdit from 'public/edit.svg';
import IconRevert from 'public/revert.svg';
import type { Order, UpdateShipTo } from '../../../interface';
import { InfoOrder } from '../../containers';
import { schemaShipTo } from '../ConfigureShipment';
import { revertAddressService } from '../../../fetch';

const Recipient = ({
  isLoadingVerify,
  onVerifyAddress,
  detail,
  onUpdateShip,
  isLoadingUpdateShipTo
}: {
  onVerifyAddress: () => Promise<void>;
  isLoadingVerify: boolean;
  detail: Order;
  onUpdateShip: (data: UpdateShipTo) => Promise<void>;
  isLoadingUpdateShipTo: boolean;
}) => {
  const { dispatch } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const [isEditRecipient, setIsEditRecipient] = useState(false);

  const handleToggle = () => {
    setIsEditRecipient((isEditRecipient) => !isEditRecipient);
  };

  const handleCancel = (event: React.MouseEvent<{}, MouseEvent>) => {
    event.preventDefault();
    setIsEditRecipient(false);
  };

  const defaultValues = useMemo(() => {
    return {
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      country: '',
      day_phone: '',
      name: '',
      postal_code: '',
      state: '',

      companyFrom: '',
      addressFrom: '',
      address2From: '',
      cityFrom: '',
      countryFrom: '',
      phoneFrom: '',
      postal_codeFrom: '',
      nameFrom: '',
      stateFrom: ''
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaShipTo)
  });

  const handleSubmitData = (data: UpdateShipTo) => {
    onUpdateShip({
      ...data,
      callback: () => handleToggle()
    });
  };

  const handleRevertAddress = async () => {
    try {
      dispatch(actions.revertAddressRequest());
      await revertAddressService(+detail?.id, {
        carrier_id: detail?.carrier?.id as never,
        ...detail?.verified_ship_to,
        status: 'ORIGIN'
      });
      dispatch(actions.revertAddressSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Revert successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.revertAddressFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Revert Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    if (detail) {
      reset({
        ...(detail.verified_ship_to || detail.ship_to),
        companyFrom: detail.ship_from?.company,
        addressFrom: detail.ship_from?.address_1,
        address2From: detail.ship_from?.address_2,
        cityFrom: detail.ship_from?.city,
        countryFrom: detail.ship_from?.country,
        phoneFrom: detail.ship_from?.phone,
        postal_codeFrom: detail.ship_from?.postal_code,
        nameFrom: detail.ship_from?.contact_name,
        stateFrom: detail.ship_from?.state
      });
      setValue('name', detail.verified_ship_to?.name || detail.customer?.name);
      setValue(
        'day_phone',
        detail.verified_ship_to?.phone || detail.customer?.day_phone || detail.ship_to?.day_phone
      );
    }
  }, [detail, reset, setValue]);

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
                          required
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
                          required
                          label="Address 1"
                          name="addressFrom"
                          error={errors.addressFrom?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="mb-3">
                    <Controller
                      control={control}
                      name="address2From"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Address 2"
                          name="address2From"
                          error={errors.address2From?.message}
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
                          required
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
                          required
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
                          required
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
                          placeholder="Example: US"
                          required
                          label="Country"
                          name="countryFrom"
                          placeholder="Example: US"
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
                          required
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
                    <p className="font-normal">{detail.ship_from?.contact_name || '-'}</p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Address 1:</p>
                    <p className="font-normal">{detail.ship_from?.address_1 || '-'}</p>
                  </div>
                  <div className="mb-[12px] flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Address 2:</p>
                    <p className="font-normal">{detail.ship_from?.address_2 || '-'}</p>
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
                    <p className="font-normal">{detail.ship_from?.phone || '-'}</p>
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
                          placeholder="Example: US"
                          label="Country"
                          required
                          name="country"
                          placeholder="Example: US"
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
                      {detail.verified_ship_to?.name || detail.customer?.name || '-'}
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
                      {detail.verified_ship_to?.phone ||
                        detail.customer?.day_phone ||
                        detail.ship_to?.day_phone ||
                        '-'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="min-w-[160px] font-medium text-santaGrey">Phone:</p>
                    <p className="font-normal">
                      {detail.verified_ship_to?.phone ||
                        detail.customer?.day_phone ||
                        detail.ship_to?.day_phone ||
                        '-'}
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
                        onClick={handleRevertAddress}
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
