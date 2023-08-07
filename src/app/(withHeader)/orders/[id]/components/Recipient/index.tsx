'use client';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import IconEdit from 'public/edit.svg';
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
        state: detail.verified_ship_to?.state || detail.ship_to?.state || ''
      };
    }
  }, [detail]);

  const {
    control,
    formState: { errors },
    handleSubmit
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
        <>
          <InfoOrder
            title={'Ship To'}
            value={
              isEditRecipient ? (
                <div className="my-2">
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

                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input {...field} label="Email" name="email" error={errors.email?.message} />
                    )}
                  />
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
                  <Controller
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="state"
                        required
                        name="state"
                        error={errors.state?.message}
                      />
                    )}
                  />
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
              ) : (
                <div>
                  <div>{detail.verified_ship_to?.name || detail.ship_to?.name || '-'}</div>
                  <div>{detail.verified_ship_to?.company || detail.ship_to?.company || '-'}</div>
                  <div>{detail.verified_ship_to?.email || detail.ship_to?.email || '-'}</div>
                  <div>
                    {detail.verified_ship_to?.address_1 || detail.ship_to?.address_1 || '-'}
                  </div>
                  <div>
                    {detail.verified_ship_to?.address_2 || detail.ship_to?.address_2 || '-'}
                  </div>
                  <div>{detail.verified_ship_to?.city || detail.ship_to?.city || '-'}</div>
                  <div>{detail.verified_ship_to?.state || detail.ship_to?.state || '-'}</div>
                  <div>
                    {detail.verified_ship_to?.postal_code || detail.ship_to?.postal_code || '-'}
                  </div>
                  <div>{detail.verified_ship_to?.country || detail.ship_to?.country || '-'}</div>
                  <div>
                    {detail.verified_ship_to?.day_phone || detail.ship_to?.day_phone || '-'}
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
                      onClick={handleToggle}
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
                        className="bg-gey100 dark:bg-gunmetal"
                        isLoading={isLoadingVerify}
                        disabled={isLoadingVerify}
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

          <InfoOrder
            title={'Customer'}
            value={
              <div>
                <div>{customer?.name || billTo?.name || ''}</div>
                <div>{customer?.company || billTo?.company || '-'}</div>
                <div>{customer?.address_1 || billTo?.address_1 || '-'}</div>
                <div>{customer?.address_2 || billTo?.address_2 || '-'}</div>
                <div>{customer?.city || billTo?.city || '-'}</div>
                <div>{customer?.state || billTo?.state || '-'}</div>
                <div>{customer?.postal_code || billTo?.postal_code || '-'}</div>
                <div>{customer?.country || billTo?.country || '-'}</div>
              </div>
            }
          />
        </>
      </form>
    </CardToggle>
  );
};

export default Recipient;
