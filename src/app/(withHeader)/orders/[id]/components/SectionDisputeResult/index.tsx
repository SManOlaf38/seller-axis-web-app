import { Controller, useForm } from 'react-hook-form';
import { useState, type Dispatch, type SetStateAction, useEffect } from 'react';

import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { RESULT_DISPUTE, schemaDisputeResult } from '../../../constants';
import { Button } from '@/components/ui/Button';
import Autocomplete from '@/components/ui/Autocomplete';

import type { DisputeResult } from '../../../interface';

type SectionDisputeResult = {
  setIsResultDispute: Dispatch<SetStateAction<boolean>>;
  setIsDispute: Dispatch<SetStateAction<boolean>>;
};

export default function SectionDisputeResult(props: SectionDisputeResult) {
  const { setIsResultDispute, setIsDispute } = props;
  const [isShowAmount, setIsShowAmount] = useState<boolean>(false);
  const defaultValues = {
    result: null,
    reimbursed_amount: 0
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaDisputeResult)
  });
  const result = watch('result');

  const onSubmitResult = (data: DisputeResult) => {};

  const onEditReason = () => {
    setIsResultDispute(false);
    setIsDispute(true);
  };

  const onDeleteDispute = () => {
    setIsResultDispute(false);
    setIsDispute(false);
  };

  useEffect(() => {
    if (result && ['REJECTED_FULL_PAYMENT', 'REFUNDED_BOTH_PARTIES'].includes(result?.value)) {
      setIsShowAmount(true);
    } else {
      setValue('reimbursed_amount', 0);
      setIsShowAmount(false);
    }
  }, [result, setValue]);

  return (
    <CardToggle title="Dispute reason" className="mt-2 grid w-full grid-cols-1 gap-2">
      <form
        className="grid w-full grid-cols-1 gap-2"
        noValidate
        onSubmit={handleSubmit(onSubmitResult)}
      >
        <div>
          <Controller
            control={control}
            name="result"
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={RESULT_DISPUTE}
                required
                label="Result"
                name="result"
                placeholder="Select result"
                addNew={false}
                error={errors.result?.message}
              />
            )}
          />
        </div>
        {isShowAmount && (
          <div>
            <Controller
              control={control}
              name="reimbursed_amount"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter reimbursed amount"
                  label="Reimbursed amount"
                  name="reimbursed_amount"
                  type="number"
                  error={errors.reimbursed_amount?.message}
                />
              )}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="mr-3 cursor-pointer text-xs text-redLight" onClick={onDeleteDispute}>
            Delete dispute request
          </span>
          <div className="flex items-center">
            <Button className="mr-3 bg-primary500 text-white" type="button" onClick={onEditReason}>
              Edit reason
            </Button>
            <Button className="bg-primary500 text-white">Submit dispute result</Button>
          </div>
        </div>
      </form>
    </CardToggle>
  );
}
