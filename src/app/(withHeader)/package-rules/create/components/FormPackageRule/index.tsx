import { Control, Controller, FieldErrors } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DATA_Dimension_Unit } from '../../../constants';

interface FormPackageRuleProps {
  control: Control<any, any>;
  isLoading: boolean;
  errors: FieldErrors<any>;
  params?: string;
  error: string;
}

const FormPackageRule = ({ control, isLoading, errors, error, params }: FormPackageRuleProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
          <div className="w-[50%]">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter name package rule"
                  label="Name"
                  required
                  name="name"
                  error={errors.name?.message}
                />
              )}
            />
          </div>
          <div className="w-[50%]">
            <Controller
              control={control}
              name="length"
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="Example: 0"
                  label="Length"
                  required
                  name="length"
                  error={errors.length?.message}
                />
              )}
            />
          </div>
          <div className="w-[50%]">
            <Controller
              control={control}
              name="wight"
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="Example: 0"
                  label="Width"
                  required
                  name="wight"
                  error={errors.wight?.message}
                />
              )}
            />
          </div>
          <div className="w-[50%]">
            <Controller
              control={control}
              name="height"
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={0}
                  placeholder="Example: 0"
                  label="Height"
                  name="height"
                  required
                  error={errors.height?.message}
                />
              )}
            />
          </div>
          <div className="w-[50%]">
            <Controller
              control={control}
              name="dimension_unit"
              render={({ field }) => (
                <Select
                  {...field}
                  required
                  label="Dimension unit"
                  options={DATA_Dimension_Unit}
                  name="dimension_unit"
                  error={errors.dimension_unit?.message?.toString()}
                />
              )}
            />
          </div>
        </div>
      </Card>

      <div className="mb-2 flex flex-col items-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-primary500">
          {params ? 'Update' : 'Create'}
        </Button>
        {error && <p className="mb-2 mt-1 block text-sm font-medium text-red">{error as string}</p>}
      </div>
    </div>
  );
};

export default FormPackageRule;
