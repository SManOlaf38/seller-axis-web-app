import { Control, Controller, FieldErrors } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface FormProductSeriesProps {
  error: string;
  errors: FieldErrors<any>;
  control: Control<any, any>;
  isLoading: boolean;
  isEdit?: boolean;
}

const FormProductSeries = ({ error, errors, control, isLoading, isEdit }: FormProductSeriesProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Controller
              control={control}
              name="series"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter series"
                  label="Series"
                  required
                  name="series"
                  error={errors.series?.message}
                />
              )}
            />
          </div>
        </div>
      </Card>

      <div className="mb-2 flex flex-col items-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-primary500">
          {isEdit ? 'Update' : 'Create'}
        </Button>

        {error && <p className="mb-2 mt-1 block text-sm font-medium text-red">{error as string}</p>}
      </div>
    </div>
  );
};

export default FormProductSeries;
