import { Button } from '@/components/ui/Button';
import IconEdit from 'public/edit.svg';
import IconRevert from 'public/revert.svg';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { InfoOrder } from '../../InfoOrder';
import { Order, UpdateShipTo } from '@/app/(withHeader)/orders/interface';
import { schemaShipTo } from '@/app/(withHeader)/orders/constants';

const ShipToRecipient = ({
  isEditRecipient,
  detail,
  onVerifyAddress,
  isLoadingVerify,
  handleRevertAddress,
  handleToggleEdit,
  isLoadingUpdateShipTo,
  onUpdateShipTo,
  retailerCarrier
}: {
  isEditRecipient: {
    shipFrom: boolean;
    shipTo: boolean;
  };
  handleToggleEdit: (name: 'shipFrom' | 'shipTo') => void;
  detail: Order;
  isLoadingUpdateShipTo: boolean;
  onVerifyAddress: () => Promise<void>;
  isLoadingVerify: boolean;
  onUpdateShipTo: (data: UpdateShipTo, callback: () => void) => Promise<void>;
  handleRevertAddress: () => Promise<void>;
  retailerCarrier: {
    label: string;
    service: number | string;
    value: number | string;
  };
}) => {
  const defaultValues = useMemo(() => {
    return {
      address_1: '',
      address_2: '',
      city: '',
      country: '',
      day_phone: '',
      contact_name: '',
      postal_code: '',
      state: ''
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaShipTo)
  });

  const handleSubmitData = (data: UpdateShipTo) => {
    onUpdateShipTo(data, () => handleToggleEdit('shipTo'));
  };

  const checkServiceUPS = useMemo(() => {
    return retailerCarrier.label.toUpperCase().includes('UPS');
  }, [retailerCarrier.label]);

  useEffect(() => {
    if (detail)
      if (checkServiceUPS) {
        reset({
          ...(detail.verified_ship_to || detail.ship_to),
          contact_name: detail.customer?.name,
          company: detail.verified_ship_to?.contact_name || detail.ship_to?.contact_name,
          day_phone: detail.verified_ship_to?.phone || detail.ship_to?.day_phone
        });
      } else {
        reset({
          ...(detail.verified_ship_to || detail.ship_to),
          day_phone: detail.verified_ship_to?.phone || detail.ship_to?.day_phone,
          contact_name: detail.verified_ship_to?.contact_name || detail.ship_to?.name
        });
      }
  }, [checkServiceUPS, detail, reset, retailerCarrier.label]);

  return (
    <form noValidate onSubmit={handleSubmit(handleSubmitData)}>
      <InfoOrder
        classNameBorder="border-none"
        className="mt-2 rounded-lg border border-lightLine p-4 dark:border-iridium"
        title={'Ship To'}
        subTitle={
          !isEditRecipient.shipTo && (
            <div className="flex items-center gap-2">
              {detail?.verified_ship_to?.id && detail?.verified_ship_to?.status === 'VERIFIED' ? (
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
              {detail?.verified_ship_to?.id &&
                (detail?.verified_ship_to?.status === 'VERIFIED' ||
                  detail?.verified_ship_to?.status === 'EDITED') && (
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
                onClick={() => handleToggleEdit('shipTo')}
                className="bg-gey100 dark:bg-gunmetal"
                startIcon={<IconEdit />}
              >
                Edit
              </Button>
            </div>
          )
        }
        value={
          isEditRecipient.shipTo ? (
            <div className="my-2">
              <div className="h-[12px]" />
              <div className="mb-3">
                <Controller
                  control={control}
                  name="company"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={checkServiceUPS ? 'Contact name/Company' : 'Company'}
                      name="company"
                      error={errors.company?.message}
                    />
                  )}
                />
              </div>
              <div className="mb-3">
                <Controller
                  control={control}
                  name="contact_name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={checkServiceUPS ? 'Attention' : 'Contact Name'}
                      required
                      name="contact_name"
                      error={errors.contact_name?.message}
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
                      type="number"
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
                      required
                      label="Phone number"
                      name="day_phone"
                      error={errors.day_phone?.message}
                    />
                  )}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleToggleEdit('shipTo')}
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
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-[12px] flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">
                  {checkServiceUPS ? 'Contact name/Company' : 'Company'}:
                </p>
                <p className="font-normal">
                  {checkServiceUPS
                    ? detail.verified_ship_to?.contact_name || detail.ship_to?.contact_name || '-'
                    : detail.verified_ship_to?.company || detail.ship_to?.company || '-'}
                </p>
              </div>
              <div className="mb-[12px] flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">
                  {' '}
                  {checkServiceUPS ? 'Attention' : 'Contact Name'} :
                </p>
                <p className="font-normal">
                  {checkServiceUPS
                    ? detail.verified_ship_to?.company || detail.ship_to?.company || '-'
                    : detail.verified_ship_to?.contact_name || detail.ship_to?.name || '-'}
                </p>
              </div>
              <div className="mb-[12px] flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">Address 1:</p>
                <p className="font-normal">{detail.verified_ship_to?.address_1 || '-'}</p>
              </div>
              <div className="mb-[12px] flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">Address 2:</p>
                <p className="font-normal">{detail.verified_ship_to?.address_2 || '-'}</p>
              </div>
              <div className="mb-[12px] flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">City:</p>
                <p className="font-normal">{detail.verified_ship_to?.city || '-'}</p>
              </div>
              <div className="mb-[12px] flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">State:</p>
                <p className="font-normal">{detail.verified_ship_to?.state || '-'}</p>
              </div>
              <div className="mb-[12px] flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">Postal Code:</p>
                <p className="font-normal">{detail.verified_ship_to?.postal_code || '-'}</p>
              </div>
              <div className="mb-[12px] flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">Country:</p>
                <p className="font-normal">
                  {detail.verified_ship_to?.country || detail.customer?.country || '-'}
                </p>
              </div>
              <div className="flex items-center">
                <p className="min-w-[160px] font-medium text-santaGrey">Phone:</p>
                <p className="font-normal">{detail.verified_ship_to?.phone || '-'}</p>
              </div>
            </div>
          )
        }
      />
    </form>
  );
};
export default ShipToRecipient;
