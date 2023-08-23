import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Autocomplete from '@/components/ui/Autocomplete';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Order, PayloadManualShip } from '../../../interface';

export const schemaManualShip = object().shape({
  ship_date: string().required('Ship date is required'),
  tracking_number: string().required('Tracking number is required'),
  service: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Service rule is required'),

  carrier: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Carrier is required')
});

const ManualShip = ({
  onCreateManualShip,
  isLoading,
  detail
}: {
  onCreateManualShip: (data: PayloadManualShip) => void;
  detail: Order;
  isLoading: boolean;
}) => {
  const defaultValues = useMemo(() => {
    return {
      ship_date: '',
      tracking_number: '',
      service: null,
      carrier: null
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaManualShip)
  });

  return (
    <CardToggle title="Manual Shipment" className="grid w-full grid-cols-1 gap-2">
      <form noValidate onSubmit={handleSubmit(onCreateManualShip)}>
        <div className="grid w-full grid-cols-2 gap-2">
          <div>
            <Controller
              control={control}
              name="carrier"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={[]}
                  handleChangeText={() => {}}
                  required
                  label="Carrier"
                  name="carrier"
                  placeholder="Select Carrier"
                  onReload={() => {}}
                  pathRedirect="/services/create"
                  error={errors.carrier?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="service"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={[]}
                  handleChangeText={() => {}}
                  required
                  label="Service"
                  name="service"
                  placeholder="Select service"
                  onReload={() => {}}
                  pathRedirect="/services/create"
                  error={errors.service?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="tracking_number"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Tracking number"
                  label="Tracking number"
                  required
                  name="tracking_number"
                  error={errors.tracking_number?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="ship_date"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter ship date"
                  label="Ship date"
                  required
                  type="date"
                  name="ship_date"
                  error={errors.ship_date?.message}
                />
              )}
            />
          </div>
        </div>
        <div className="my-4 flex flex-col items-end">
          <Button
            disabled={isLoading || detail?.status !== 'Acknowledged'}
            isLoading={isLoading}
            className="bg-primary500"
          >
            Manual Ship
          </Button>
        </div>
      </form>
    </CardToggle>
  );
};

export default ManualShip;
