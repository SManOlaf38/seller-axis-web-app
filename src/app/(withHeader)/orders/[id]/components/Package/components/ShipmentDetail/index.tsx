import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { number, object, string } from 'yup';

import { Order } from '@/app/(withHeader)/orders/interface';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const schemaShipmentDetail = object().shape({
  ship_date: string().required('SKU is required'),
  number_of_package: number()
    .required('Number of package is required')
    .typeError('Number of package is required'),
  weight: number().required('Weight is required').typeError('Weight is required'),
  declared_value: number()
    .required('Declared value is required')
    .typeError('Declared value is required')
});

const ShipmentDetail = ({ orderDetail }: { orderDetail: Order }) => {
  const [itemsDimensions, setItemsDimensions] = useState([
    {
      id: 1,
      width: 1,
      length: 1,
      height: 1
    },
    { id: 2, width: 2, length: 2, height: 2 },
    { id: 3, width: 2, length: 2, height: 2 },
    { id: 4, width: 2, length: 2, height: 2 },
    { id: 5, width: 2, length: 2, height: 2 },
    { id: 6, width: 2, length: 2, height: 2 }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string, itemData: any) => {
    const oldData = [...itemsDimensions];
    if (+e.target.value >= 0) {
      const newData = oldData.map((item) =>
        item.id === itemData.id
          ? {
              ...item,
              [name]: e.target.value
            }
          : item
      );

      setItemsDimensions(newData);
    }
  };

  const defaultValues = useMemo(() => {
    return {
      ship_date: dayjs(new Date()).format('YYYY-MM-DD'),
      number_of_package: 2,
      weight: orderDetail?.weight || 0,
      declared_value: orderDetail?.declared_value || 0
    };
  }, [orderDetail]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaShipmentDetail)
  });

  const handleSubmitData = (data: any) => {};

  useEffect(() => {
    orderDetail &&
      reset({
        weight: orderDetail?.weight,
        declared_value: orderDetail?.declared_value,
        ship_date: dayjs(orderDetail?.ship_date).format('YYYY-MM-DD')
      });
  }, [orderDetail, reset]);

  return (
    <form noValidate onSubmit={handleSubmit(handleSubmitData)}>
      <Card className="grid w-full grid-cols-1 gap-4">
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
        <div>
          <Controller
            control={control}
            name="number_of_package"
            render={({ field }) => (
              <Input
                {...field}
                disabled
                label="Number of package"
                name="number_of_package"
                type="number"
                error={errors.number_of_package?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="weight"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter Weight"
                className="w-full"
                label="Weight"
                required
                name="weight"
                type="number"
                error={errors.weight?.message}
                endIcon={<span>lbs</span>}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="declared_value"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter declared value"
                label="Declared value"
                required
                name="declared_value"
                type="number"
                error={errors.declared_value?.message}
                endIcon={<span>U.S Dollars</span>}
              />
            )}
          />
        </div>
        <div className="scrollbar-thumb-gray scrollbar-track-gray max-h-[100px] overflow-y-scroll">
          <label>Dimensions</label>
          {itemsDimensions?.map((item) => (
            <div className="mt-2 flex items-center gap-2" key={item.id}>
              <span className="whitespace-nowrap">Box 1 :</span>
              <div>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, 'width', item)
                  }
                  value={item.width}
                  placeholder="Width"
                  required
                  type="number"
                  min={0}
                  name="width"
                />
              </div>
              <div>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, 'length', item)
                  }
                  value={item.length}
                  placeholder="Length"
                  required
                  type="number"
                  min={0}
                  name="length"
                />
              </div>
              <div>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, 'height', item)
                  }
                  value={item.height}
                  placeholder="Height"
                  required
                  type="number"
                  min={0}
                  name="height"
                />
              </div>
              <span>In</span>
            </div>
          ))}
        </div>
      </Card>
    </form>
  );
};

export default ShipmentDetail;
