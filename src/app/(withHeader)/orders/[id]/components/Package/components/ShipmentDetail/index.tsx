import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const ShipmentDetail = () => {
  const [itemsDimensions, setItemsDimensions] = useState([
    {
      id: 1,
      width: 1,
      length: 1,
      height: 1
    },
    { id: 2, width: 2, length: 2, height: 2 }
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
      ship_date: '',
      number_of_package: 2,
      weight: '',
      declared_value: ''
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

  const handleSubmitData = (data: any) => {};

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
                label="Number of package"
                required
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
                label="Weight"
                required
                name="weight"
                error={errors.weight?.message}
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
                error={errors.declared_value?.message}
              />
            )}
          />
        </div>

        <div>
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
