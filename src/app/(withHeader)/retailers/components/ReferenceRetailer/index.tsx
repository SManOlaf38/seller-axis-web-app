import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Dispatch, SetStateAction, memo } from 'react';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SelectReference } from '../SelectReference';
import { ShipRefType } from '../../interface';

type FormReference = {
  errors: FieldErrors<any>;
  control: Control<any, any>;
  valueReference: ShipRefType;
  setValueReference: Dispatch<SetStateAction<ShipRefType>>;
};

function ReferenceRetailer({ errors, control, valueReference, setValueReference }: FormReference) {
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
                  placeholder={`${valueReference?.shipping_ref_1?.id ? '' : 'Reference Number #1'}`}
                  style={{
                    paddingLeft: valueReference?.shipping_ref_1?.id
                      ? valueReference?.shipping_ref_1?.name.length * 9 + 15 + 'px'
                      : ''
                  }}
                  label="Reference Number #1"
                  name="shipping_ref_1_value"
                  error={errors.shipping_ref_1_value?.message}
                  startIcon={
                    valueReference?.shipping_ref_1?.id ? (
                      <div className="h-[18px] rounded-sm border bg-grey300 px-1 text-xs text-darkGreen">
                        {valueReference?.shipping_ref_1?.name}
                      </div>
                    ) : (
                      <div />
                    )
                  }
                />
              )}
            />
          </div>
          <SelectReference
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
                  placeholder={`${valueReference?.shipping_ref_2?.id ? '' : 'Reference Number #2'}`}
                  style={{
                    paddingLeft: valueReference?.shipping_ref_2?.id
                      ? valueReference?.shipping_ref_2?.name.length * 9 + 15 + 'px'
                      : ''
                  }}
                  label="Reference Number #2"
                  name="shipping_ref_2_value"
                  error={errors.shipping_ref_2_value?.message}
                  startIcon={
                    valueReference?.shipping_ref_2?.id ? (
                      <div className="h-[18px] rounded-sm border bg-grey300 px-1 text-xs text-darkGreen">
                        {valueReference?.shipping_ref_2?.name}
                      </div>
                    ) : (
                      <div />
                    )
                  }
                />
              )}
            />
          </div>
          <SelectReference
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
                  placeholder={`${valueReference?.shipping_ref_3?.id ? '' : 'Reference Number #3'}`}
                  style={{
                    paddingLeft: valueReference?.shipping_ref_3?.id
                      ? valueReference?.shipping_ref_3?.name.length * 9 + 15 + 'px'
                      : ''
                  }}
                  label="Reference Number #3"
                  name="shipping_ref_3_value"
                  error={errors.shipping_ref_3_value?.message}
                  startIcon={
                    valueReference?.shipping_ref_3?.id ? (
                      <div className="h-[18px] rounded-sm border bg-grey300 px-1 text-xs text-darkGreen">
                        {valueReference?.shipping_ref_3?.name}
                      </div>
                    ) : (
                      <div />
                    )
                  }
                />
              )}
            />
          </div>
          <SelectReference
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
                  placeholder={`${valueReference?.shipping_ref_4?.id ? '' : 'Reference Number #4'}`}
                  style={{
                    paddingLeft: valueReference?.shipping_ref_4?.id
                      ? valueReference?.shipping_ref_4?.name.length * 9 + 15 + 'px'
                      : ''
                  }}
                  label="Reference Number #4"
                  name="shipping_ref_4_value"
                  error={errors.shipping_ref_4_value?.message}
                  startIcon={
                    valueReference?.shipping_ref_4?.id ? (
                      <div className="h-[18px] rounded-sm border bg-grey300 px-1 text-xs text-darkGreen">
                        {valueReference?.shipping_ref_4?.name}
                      </div>
                    ) : (
                      <div />
                    )
                  }
                />
              )}
            />
          </div>
          <SelectReference
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
                  placeholder={`${valueReference?.shipping_ref_5?.id ? '' : 'Reference Number #5'}`}
                  style={{
                    paddingLeft: valueReference?.shipping_ref_5?.id
                      ? valueReference?.shipping_ref_5?.name.length * 9 + 15 + 'px'
                      : ''
                  }}
                  label="Reference Number #5"
                  name="shipping_ref_5_value"
                  error={errors.shipping_ref_5_value?.message}
                  startIcon={
                    valueReference?.shipping_ref_5?.id ? (
                      <div className="h-[18px] rounded-sm border bg-grey300 px-1 text-xs text-darkGreen">
                        {valueReference?.shipping_ref_5?.name}
                      </div>
                    ) : (
                      <div />
                    )
                  }
                />
              )}
            />
          </div>
          <SelectReference
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
