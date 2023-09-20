import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SelectReference } from '../SelectReference';

type FormReference = {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  setValue: UseFormSetValue<any>;
};

export default function ReferenceRetailer({ errors, control, setValue }: FormReference) {
  return (
    <Card className="mt-2">
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_1"
              render={({ field }) => (
                <Input
                  {...field}
                  required
                  placeholder="Reference Number #1"
                  label="Reference Number #1"
                  name="shipping_ref_1"
                  error={errors.shipping_ref_1?.message}
                />
              )}
            />
          </div>
          <SelectReference setValue={setValue} keyRef="shipping_ref_1" />
        </div>

        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_2"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #2"
                  label="Reference Number #2"
                  name="shipping_ref_2"
                  error={errors.shipping_ref_2?.message}
                />
              )}
            />
          </div>
          <SelectReference setValue={setValue} keyRef="shipping_ref_2" />
        </div>
        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_3"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #3"
                  label="Reference Number #3"
                  name="shipping_ref_3"
                  error={errors.shipping_ref_3?.message}
                />
              )}
            />
          </div>
          <SelectReference setValue={setValue} keyRef="shipping_ref_3" />
        </div>
        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_4"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #4"
                  label="Reference Number #4"
                  name="shipping_ref_4"
                  error={errors.shipping_ref_4?.message}
                />
              )}
            />
          </div>
          <SelectReference setValue={setValue} keyRef="shipping_ref_4" />
        </div>
        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_5"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #5"
                  label="Reference Number #5"
                  name="shipping_ref_5"
                  error={errors.shipping_ref_5?.message}
                />
              )}
            />
          </div>
          <SelectReference setValue={setValue} keyRef="shipping_ref_5" />
        </div>
      </div>
    </Card>
  );
}
