import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Dispatch, SetStateAction, memo } from 'react';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SelectReference } from '../SelectReference';
import { ShipRefType } from '../../interface';

type FormReference = {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  valueReference: ShipRefType;
  setValue: UseFormSetValue<any>;
  setValueReference: Dispatch<SetStateAction<ShipRefType>>;
};

function ReferenceRetailer({
  errors,
  control,
  valueReference,
  setValueReference,
  setValue
}: FormReference) {
  return (
    <Card>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_1_value"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #1"
                  label="Reference Number #1"
                  name="shipping_ref_1_value"
                  error={errors.shipping_ref_1_value?.message}
                />
              )}
            />
          </div>
          <SelectReference
            setValue={setValue}
            valueReference={valueReference}
            setValueReference={setValueReference}
            keyRef="shipping_ref_1"
          />
        </div>

        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_2_value"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #2"
                  label="Reference Number #2"
                  name="shipping_ref_2_value"
                  error={errors.shipping_ref_2_value?.message}
                />
              )}
            />
          </div>
          <SelectReference
            setValue={setValue}
            valueReference={valueReference}
            setValueReference={setValueReference}
            keyRef="shipping_ref_2"
          />
        </div>
        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_3_value"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #3"
                  label="Reference Number #3"
                  name="shipping_ref_3_value"
                  error={errors.shipping_ref_3_value?.message}
                />
              )}
            />
          </div>
          <SelectReference
            setValue={setValue}
            valueReference={valueReference}
            setValueReference={setValueReference}
            keyRef="shipping_ref_3"
          />
        </div>
        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_4_value"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #4"
                  label="Reference Number #4"
                  name="shipping_ref_4_value"
                  error={errors.shipping_ref_4_value?.message}
                />
              )}
            />
          </div>
          <SelectReference
            setValue={setValue}
            valueReference={valueReference}
            setValueReference={setValueReference}
            keyRef="shipping_ref_4"
          />
        </div>
        <div className="flex items-end justify-between">
          <div className="mr-2 w-full">
            <Controller
              control={control}
              name="shipping_ref_5_value"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Reference Number #5"
                  label="Reference Number #5"
                  name="shipping_ref_5_value"
                  error={errors.shipping_ref_5_value?.message}
                />
              )}
            />
          </div>
          <SelectReference
            setValue={setValue}
            valueReference={valueReference}
            setValueReference={setValueReference}
            keyRef="shipping_ref_5"
          />
        </div>
      </div>
    </Card>
  );
}

export default memo(ReferenceRetailer);
