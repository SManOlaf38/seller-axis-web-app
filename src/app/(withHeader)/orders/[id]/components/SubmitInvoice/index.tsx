import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaManualShip } from '../ManualShip';

export const DiscTypeCodeArray = [
  {
    value: '01',
    label: '01 - Basic'
  },
  {
    value: '09',
    label: '09 - Proximo'
  }
];
export const DiscDateCodeArray = [
  {
    value: '2',
    label: '2 - Delivery Date'
  },
  {
    value: '3',
    label: '3 - Invoice Date'
  }
];

interface SubmitInvoice {
  onSubmitInvoice: (data: any) => void;
  isLoading: boolean;
}

const SubmitInvoice = ({ onSubmitInvoice, isLoading }: SubmitInvoice) => {
  const defaultValues = useMemo(() => {
    return {
      invoice_number: '',
      handling_charge: 0,
      invoice_credit: 0,
      terms_net_days_due: 30,
      allowances: 0,
      charges: 0,
      invoice_date: '',
      terms_discount_percent: 0,
      terms_discount_days_due: 0,
      invoice_total: 0,
      disc_type_code: '01',
      disc_date_code: '3'
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaManualShip)
  });

  return (
    <CardToggle title="Submit Invoice" className="grid w-full grid-cols-1 gap-2">
      <form noValidate onSubmit={handleSubmit(onSubmitInvoice)}>
        <div className="grid w-full grid-cols-2 gap-2">
          <div>
            <Controller
              control={control}
              name="invoice_number"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter invoice number"
                  label="Invoice number"
                  required
                  name="invoice_number"
                  error={errors.invoice_number?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="handling_charge"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter handling charge"
                  label="Handling charge"
                  required
                  name="handling_charge"
                  error={errors.handling_charge?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="invoice_credit"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Invoice credit"
                  label="Invoice credit"
                  required
                  name="invoice_credit"
                  error={errors.invoice_credit?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="terms_net_days_due"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter terms net days due"
                  label="Terms net days due"
                  required
                  name="terms_net_days_due"
                  error={errors.terms_net_days_due?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="allowances"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter allowances"
                  label="Allowances"
                  required
                  name="allowances"
                  error={errors.allowances?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="charges"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter charges"
                  label="Charges"
                  required
                  name="charges"
                  error={errors.charges?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="invoice_date"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter invoice_date"
                  label="Invoice date"
                  required
                  type="date"
                  name="invoice_date"
                  error={errors.invoice_date?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="terms_discount_percent"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter terms discount percent"
                  label="Terms discount percent"
                  required
                  name="terms_discount_percent"
                  error={errors.terms_discount_percent?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="terms_discount_days_due"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter terms discount days due"
                  label="Terms discount days due"
                  required
                  name="terms_discount_days_due"
                  error={errors.terms_discount_days_due?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="invoice_total"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter invoice total"
                  label="Invoice total"
                  required
                  name="invoice_total"
                  error={errors.invoice_total?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="disc_type_code"
              render={({ field }) => (
                <Select
                  {...field}
                  required
                  label="Disc type code"
                  options={DiscTypeCodeArray}
                  name="disc_type_code"
                  error={errors.disc_type_code?.message?.toString()}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="disc_date_code"
              render={({ field }) => (
                <Select
                  {...field}
                  required
                  label="Disc date code"
                  options={DiscDateCodeArray}
                  name="disc_date_code"
                  error={errors.disc_date_code?.message?.toString()}
                />
              )}
            />
          </div>
        </div>
        <div className="my-4 flex flex-col items-end">
          <Button disabled={isLoading} isLoading={isLoading} className="bg-primary500">
            Submit invoice
          </Button>
        </div>
      </form>
    </CardToggle>
  );
};

export default SubmitInvoice;
