import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import * as yup from 'yup';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { minDate } from '@/constants';

export const schemaBackOrder = yup.object().shape({
  estimated_ship_date: yup.string().required('Estimated ship date is required'),
  estimated_delivery_date: yup.string().required('Estimated delivery date is required')
});

const BackOrder = ({
  onClose,
  onSubmitBackOrder,
  isLoadingBackOrder
}: {
  onClose: () => void;
  onSubmitBackOrder: (data: {
    estimated_ship_date: string;
    estimated_delivery_date: string;
  }) => Promise<void>;
  isLoadingBackOrder: boolean;
}) => {
  const [estimatedShipDate, setEstimatedShipDate] = useState(minDate());
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<null | string>(null);

  const defaultValues = {
    estimated_ship_date: '',
    estimated_delivery_date: ''
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaBackOrder)
  });

  const handleSubmitBackOrder = (data: {
    estimated_ship_date: string;
    estimated_delivery_date: string;
  }) => {
    onSubmitBackOrder(data);
    reset({
      estimated_ship_date: '',
      estimated_delivery_date: ''
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(handleSubmitBackOrder)}>
      <Controller
        control={control}
        name="estimated_ship_date"
        render={({ field }) => (
          <Input
            {...field}
            required
            min={estimatedDeliveryDate || minDate()}
            type="date"
            label="Estimate ship date"
            name="estimated_ship_date"
            error={errors.estimated_ship_date?.message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange(e);
              setEstimatedShipDate(e.target.value);
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="estimated_delivery_date"
        render={({ field }) => (
          <Input
            {...field}
            required
            min={minDate()}
            max={estimatedShipDate}
            type="date"
            label="Estimate delivery date"
            name="estimated_delivery_date"
            error={errors.estimated_delivery_date?.message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange(e);
              setEstimatedDeliveryDate(e.target.value);
            }}
          />
        )}
      />

      <div className="mt-4 flex justify-end">
        <Button onClick={onClose} type="button">
          Cancel
        </Button>
        <Button
          isLoading={isLoadingBackOrder}
          disabled={isLoadingBackOrder}
          className="bg-primary500 text-white"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default BackOrder;
