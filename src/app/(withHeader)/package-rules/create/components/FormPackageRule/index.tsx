import { Control, Controller, FieldErrors } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface FormPackageRuleProps {
  control: Control<any, any>;
  isLoading: boolean;
  errors: FieldErrors<any>;
}

const FormPackageRule = ({ control, isLoading, errors }: FormPackageRuleProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Card>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
          <div>
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
        </div>
      </Card>

      <div className="mb-2 flex justify-end">
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-primary500">
          Create
        </Button>
      </div>
    </div>
  );
};

export default FormPackageRule;
