import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { number, object, string } from 'yup';

import {
  Order,
  OrderPackage,
  SaveShipmentDetail,
  ShippingService
} from '@/app/(withHeader)/orders/interface';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { minDate } from '@/constants';

const schemaShipmentDetail = object().shape({
  ship_date: string().required('Ship date is required'),
  number_of_package: number()
    .required('Number of package is required')
    .typeError('Number of package is required'),
  declared_value: number()
    .required('Declared value is required')
    .typeError('Declared value is required')
});

const ShipmentDetail = ({
  orderDetail,
  onSaveShipment,
  isLoadingSaveShipment,
  setIsCheckDimensions,
  itemShippingService,
  orderPackageNotShip
}: {
  orderDetail: Order;
  onSaveShipment: (data: SaveShipmentDetail) => void;
  itemShippingService: ShippingService | undefined;
  setIsCheckDimensions: Dispatch<SetStateAction<boolean>>;
  isLoadingSaveShipment: boolean;
  orderPackageNotShip: OrderPackage[];
}) => {
  const [itemsDimensions, setItemsDimensions] = useState<OrderPackage[]>([]);
  const [isEditDimensions, setIsEditDimensions] = useState(false);

  const totalPerimeter = useMemo(() => {
    return itemsDimensions.reduce((total, box) => {
      const { height, length, width } = box;
      const perimeter = 2 * (+length + +width + +height);
      return total + perimeter;
    }, 0);
  }, [itemsDimensions]);

  const totalWeight = useMemo(() => {
    return itemsDimensions.reduce((accumulator, currentItem) => {
      return accumulator + (+currentItem?.weight || 0);
    }, 0);
  }, [itemsDimensions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string, itemData: any) => {
    const oldData = [...itemsDimensions];
    if (+e.target.value >= 0) {
      setIsEditDimensions(true);
      const newData = oldData.map((item) =>
        item.id === itemData.id
          ? {
              ...item,
              [name]: +e.target.value
            }
          : item
      );

      setItemsDimensions(newData);
    }
  };

  const defaultValues = useMemo(() => {
    return {
      ship_date: dayjs(new Date()).format('YYYY-MM-DD'),
      number_of_package: 0,
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

  const handleSaveShipment = (data: any) => {
    onSaveShipment({
      ...data,
      package_data: itemsDimensions,
      isEditDimensions
    });
  };

  useEffect(() => {
    if (orderDetail) {
      setItemsDimensions(orderPackageNotShip);
      reset({
        declared_value: orderDetail?.declared_value,
        ship_date: dayjs(orderDetail?.ship_date || new Date()).format('YYYY-MM-DD'),
        number_of_package: orderPackageNotShip?.length
      });
    }
  }, [orderDetail, orderPackageNotShip, reset]);

  useEffect(() => {
    const isValid =
      itemShippingService &&
      (totalPerimeter > +itemShippingService.max_length_plus_girth ||
        Math.round(totalWeight) > +itemShippingService.max_weight);

    const isPackageLimit =
      itemShippingService?.max_package &&
      orderPackageNotShip?.length > itemShippingService.max_package;

    const shouldCheckDimensions = isValid || isPackageLimit;

    setIsCheckDimensions(Boolean(shouldCheckDimensions));
  }, [
    itemShippingService,
    itemsDimensions,
    setIsCheckDimensions,
    totalPerimeter,
    totalWeight,
    orderPackageNotShip?.length
  ]);

  return (
    <form noValidate onSubmit={handleSubmit(handleSaveShipment)} className="w-[46%]">
      <div className="flex py-4">
        <Button
          isLoading={isLoadingSaveShipment}
          disabled={isLoadingSaveShipment}
          className="bg-primary500 text-white"
        >
          Save
        </Button>
      </div>
      <Card className="grid max-h-[410px] w-full grid-cols-1 gap-4">
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
                min={minDate()}
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
        <div className="max-h-[160px] overflow-y-auto">
          <label>Dimensions</label>
          {itemsDimensions?.map((item) => (
            <>
              <div className="mt-2 flex items-center gap-2" key={item.id}>
                <span className="whitespace-nowrap text-sm">{item.box.name || ''} :</span>
                <div className="flex items-center">
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
                      otherElement={<div className="mx-1 text-sm"> W</div>}
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
                      otherElement={<div className="mx-1 text-sm">L</div>}
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
                      otherElement={<div className="mx-1 text-sm">H</div>}
                    />
                  </div>
                  <span className="ml-1 text-sm">{`(${item.dimension_unit})`}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end">
                <span className="mr-1 text-sm">Weight </span>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, 'weight', item)
                  }
                  value={Math.round(+item.weight)}
                  placeholder="Weight"
                  required
                  type="number"
                  min={0}
                  name="weight"
                />
                <span className="ml-1 text-sm">{`(${item.weight_unit})`}</span>
              </div>
            </>
          ))}
        </div>
      </Card>
    </form>
  );
};

export default ShipmentDetail;
