import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import type { Dispatch, SetStateAction } from 'react';

import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { REASON_DISPUTE, schemaDisputeReason } from '../../../constants';
import { minDate } from '@/constants';
import { Button } from '@/components/ui/Button';
import Autocomplete from '@/components/ui/Autocomplete';

import type { DisputeReason } from '../../../interface';

type SectionDispute = {
  setIsDispute: Dispatch<SetStateAction<boolean>>;
  isResultDispute: boolean;
  isDispute: boolean;
  setIsResultDispute: Dispatch<SetStateAction<boolean>>;
};

export default function SectionDispute(props: SectionDispute) {
  const { setIsDispute, setIsResultDispute } = props;
  const defaultValues = {
    reason: null,
    date: dayjs(new Date()).format('YYYY-MM-DD')
  };

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaDisputeReason)
  });

  const onSubmitReason = (data: DisputeReason) => {
    setIsDispute(false);
    setIsResultDispute(true);
  };

  return (
    <CardToggle title="Dispute reason" className="mt-2 grid w-full grid-cols-1 gap-2">
      <form
        className="grid w-full grid-cols-1 gap-2"
        noValidate
        onSubmit={handleSubmit(onSubmitReason)}
      >
        <div>
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={REASON_DISPUTE}
                required
                label="Reason"
                name="reason"
                placeholder="Select reason"
                addNew={false}
                error={errors.reason?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter date"
                label="Date"
                type="date"
                name="date"
                min={minDate()}
                error={errors.date?.message}
              />
            )}
          />
        </div>
        <div className="flex flex-col items-end">
          <Button className="bg-primary500 text-white">Submit</Button>
        </div>
      </form>
    </CardToggle>
  );
}
