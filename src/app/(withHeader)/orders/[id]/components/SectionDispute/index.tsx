import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useEffect, type Dispatch, type SetStateAction } from 'react';

import * as actions from '@/app/(withHeader)/orders/context/action';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/orders/context';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { REASON_DISPUTE, schemaDisputeReason } from '../../../constants';
import { minDate } from '@/constants';
import { Button } from '@/components/ui/Button';
import Autocomplete from '@/components/ui/Autocomplete';

import type { DisputeReason, TypeOrderReturn } from '../../../interface';
import { editReturnReasonService, submitReturnReasonService } from '../../../fetch';
import { convertDateToISO8601 } from '@/utils/utils';

type SectionDispute = {
  setIsDispute: Dispatch<SetStateAction<boolean>>;
  isResultDispute: boolean;
  isDispute: boolean;
  setIsResultDispute: Dispatch<SetStateAction<boolean>>;
  orderReturn: TypeOrderReturn;
};

export default function SectionDispute(props: SectionDispute) {
  const {
    state: { isLoadingReturnReason },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { setIsDispute, setIsResultDispute, orderReturn } = props;
  const defaultValues = {
    reason: null,
    date: dayjs(new Date()).format('YYYY-MM-DD')
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaDisputeReason)
  });

  const onSubmitReason = async (data: DisputeReason) => {
    if (orderReturn?.dispute_status) {
      const bodyEdit = {
        dispute_result: null,
        reimbursed_amount: null,
        dispute_reason: data?.reason?.value,
        dispute_at: convertDateToISO8601(data?.date),
        dispute_status: 'Dispute requested',
        updated_dispute_at: dayjs().toISOString()
      };
      try {
        dispatch(actions.editReturnReasonRequest());
        const res = await editReturnReasonService(bodyEdit, orderReturn?.id);
        dispatch(actions.editReturnReasonSuccess(res));
        setIsDispute(false);
        setIsResultDispute(true);
        dispatchAlert(
          openAlertMessage({
            message: 'Update dispute reason successfully',
            color: 'success',
            title: 'Success'
          })
        );
      } catch (error: any) {
        dispatch(actions.editReturnReasonFailure());
        dispatchAlert(
          openAlertMessage({
            message: error?.message || 'Update dispute reason fail',
            color: 'error',
            title: 'Fail'
          })
        );
      }
    } else {
      const body = {
        dispute_reason: data?.reason?.value,
        dispute_at: convertDateToISO8601(data?.date),
        dispute_status: 'Dispute requested',
        updated_dispute_at: dayjs().toISOString()
      };
      try {
        dispatch(actions.submitReturnReasonRequest());
        const res = await submitReturnReasonService(body, orderReturn?.id);
        dispatch(actions.submitReturnReasonSuccess(res));
        setIsDispute(false);
        setIsResultDispute(true);
        dispatchAlert(
          openAlertMessage({
            message: 'Create dispute reason successfully',
            color: 'success',
            title: 'Success'
          })
        );
      } catch (error: any) {
        dispatch(actions.submitReturnReasonFailure());
        dispatchAlert(
          openAlertMessage({
            message: error?.message || 'Create dispute reason fail',
            color: 'error',
            title: 'Fail'
          })
        );
      }
    }
  };

  const onCancelEditReasonDispute = () => {
    setIsResultDispute(true);
    setIsDispute(false);
  };

  useEffect(() => {
    if (orderReturn?.dispute_status) {
      setValue('reason', {
        label: orderReturn?.dispute_reason,
        value: orderReturn?.dispute_reason
      });
      setValue('date', dayjs(orderReturn?.dispute_at).format('YYYY-MM-DD'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(orderReturn), setValue]);

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
          {orderReturn?.dispute_status ? (
            <div className="flex items-center">
              <Button
                onClick={onCancelEditReasonDispute}
                type="button"
                disabled={isLoadingReturnReason}
                className="mr-3 bg-gey100 dark:bg-gunmetal"
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoadingReturnReason}
                disabled={isLoadingReturnReason}
                className="bg-primary500 text-white"
              >
                Update Reason
              </Button>
            </div>
          ) : (
            <Button
              isLoading={isLoadingReturnReason}
              disabled={isLoadingReturnReason}
              className="bg-primary500 text-white"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </CardToggle>
  );
}
