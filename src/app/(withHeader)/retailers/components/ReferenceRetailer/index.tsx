import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ChangeEvent, memo } from 'react';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SelectReference } from '../SelectReference';
import { ShipRefType, ShipRefTypeResult } from '../../interface';
import { ReferenceKey } from '../../constants';
import { hasMismatch } from '@/utils/utils';
import { errorServiceShipping } from '@/constants';

type FormReference = {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  valueReference: ShipRefType;
  servicesShip: string[];
  watch: UseFormWatch<any>;
  handleSelectRef: (item: ShipRefTypeResult, keyRef: ReferenceKey) => void;
  onChangeRef: (e: ChangeEvent<HTMLInputElement>, fieldName: string, referenceKey: string) => void;
};

function ReferenceRetailer({
  errors,
  control,
  valueReference,
  servicesShip,
  watch,
  handleSelectRef,
  onChangeRef
}: FormReference) {
  return (
    <Card>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Controller
              control={control}
              name="shipping_ref_1_value"
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeRef(e, 'shipping_ref_1_value', 'shipping_ref_1')
                  }
                  placeholder="Reference Number #1"
                  label="Reference Number #1"
                  name="shipping_ref_1_value"
                  error={
                    hasMismatch(watch('shipping_ref_1_value'), servicesShip)
                      ? errorServiceShipping
                      : errors.shipping_ref_1_value?.message
                  }
                  otherElement={
                    <div className="ml-2">
                      <SelectReference
                        handleSelectRef={handleSelectRef}
                        valueReference={valueReference}
                        keyRef="shipping_ref_1"
                      />
                    </div>
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="w-full">
            <Controller
              control={control}
              name="shipping_ref_2_value"
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeRef(e, 'shipping_ref_2_value', 'shipping_ref_2')
                  }
                  placeholder="Reference Number #2"
                  label="Reference Number #2"
                  name="shipping_ref_2_value"
                  error={
                    hasMismatch(watch('shipping_ref_2_value'), servicesShip)
                      ? errorServiceShipping
                      : errors.shipping_ref_2_value?.message
                  }
                  otherElement={
                    <div className="ml-2">
                      <SelectReference
                        handleSelectRef={handleSelectRef}
                        valueReference={valueReference}
                        keyRef="shipping_ref_2"
                      />
                    </div>
                  }
                />
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Controller
              control={control}
              name="shipping_ref_3_value"
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeRef(e, 'shipping_ref_3_value', 'shipping_ref_3')
                  }
                  placeholder="Reference Number #3"
                  label="Reference Number #3"
                  name="shipping_ref_3_value"
                  error={
                    hasMismatch(watch('shipping_ref_3_value'), servicesShip)
                      ? errorServiceShipping
                      : errors.shipping_ref_3_value?.message
                  }
                  otherElement={
                    <div className="ml-2">
                      <SelectReference
                        handleSelectRef={handleSelectRef}
                        valueReference={valueReference}
                        keyRef="shipping_ref_3"
                      />
                    </div>
                  }
                />
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Controller
              control={control}
              name="shipping_ref_4_value"
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeRef(e, 'shipping_ref_4_value', 'shipping_ref_4')
                  }
                  placeholder="Reference Number #4"
                  label="Reference Number #4"
                  name="shipping_ref_4_value"
                  error={
                    hasMismatch(watch('shipping_ref_4_value'), servicesShip)
                      ? errorServiceShipping
                      : errors.shipping_ref_4_value?.message
                  }
                  otherElement={
                    <div className="ml-2">
                      <SelectReference
                        handleSelectRef={handleSelectRef}
                        valueReference={valueReference}
                        keyRef="shipping_ref_4"
                      />
                    </div>
                  }
                />
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Controller
              control={control}
              name="shipping_ref_5_value"
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeRef(e, 'shipping_ref_5_value', 'shipping_ref_5')
                  }
                  placeholder="Reference Number #5"
                  label="Reference Number #5"
                  name="shipping_ref_5_value"
                  error={
                    hasMismatch(watch('shipping_ref_5_value'), servicesShip)
                      ? errorServiceShipping
                      : errors.shipping_ref_5_value?.message
                  }
                  otherElement={
                    <div className="ml-2">
                      <SelectReference
                        handleSelectRef={handleSelectRef}
                        valueReference={valueReference}
                        keyRef="shipping_ref_5"
                      />
                    </div>
                  }
                />
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default memo(ReferenceRetailer);
