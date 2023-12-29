import { Controller, useForm } from 'react-hook-form';
import { useState, type Dispatch, type SetStateAction, useEffect } from 'react';
import dayjs from 'dayjs';

import * as actions from '@/app/(withHeader)/orders/context/action';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/orders/context';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { RESULT_DISPUTE, STATUS_RETURN, schemaDisputeResult } from '../../../constants';
import { Button } from '@/components/ui/Button';
import Autocomplete from '@/components/ui/Autocomplete';
import { Status } from '@/components/ui/Status';

import type { DisputeResult, TypeOrderReturn } from '../../../interface';
import { deleteReturnReasonService, submitReturnResultService } from '../../../fetch';
import useToggleModal from '@/hooks/useToggleModal';
import ModalConfirmDeleteDispute from '../ModalConfirmDeleteDispute';

type SectionDisputeResult = {
  setIsResultDispute: Dispatch<SetStateAction<boolean>>;
  setIsDispute: Dispatch<SetStateAction<boolean>>;
  orderReturn: TypeOrderReturn;
};

export default function SectionDisputeResult(props: SectionDisputeResult) {
  const { setIsResultDispute, setIsDispute, orderReturn } = props;
  const { openModal, handleToggleModal } = useToggleModal();
  const {
    state: { isLoadingReturnReason, isLoadingReturnResult },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const [isShowAmount, setIsShowAmount] = useState<boolean>(false);
  const defaultValues = {
    result: null,
    reimbursed_amount: 0,
    dispute_id: ''
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

  const onSubmitResult = async (data: DisputeResult) => {
    const body = {
      dispute_id: data.dispute_id,
      dispute_result: data.result.value,
      reimbursed_amount: data?.reimbursed_amount === 0 ? null : data.reimbursed_amount,
      dispute_status:
        data?.reimbursed_amount === 0
          ? STATUS_RETURN.dispute_denied
          : STATUS_RETURN.dispute_reimbursed,
      updated_dispute_at: dayjs().toISOString()
    };
    try {
      dispatch(actions.submitReturnResultRequest());
      const res = await submitReturnResultService(body, orderReturn?.id);
      dispatch(actions.submitReturnResultSuccess(res));
      setIsDispute(false);
      setIsResultDispute(true);
      dispatchAlert(
        openAlertMessage({
          message: 'Create dispute successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.submitReturnResultFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Create dispute fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const onEditReason = () => {
    setIsResultDispute(false);
    setIsDispute(true);
  };

  const onDeleteDispute = async () => {
    const body = {
      dispute_id: null,
      dispute_reason: null,
      reimbursed_amount: null,
      dispute_result: null,
      dispute_at: null,
      updated_dispute_at: null,
      dispute_status: null
    };
    try {
      dispatch(actions.deleteReturnReasonRequest());
      const res = await deleteReturnReasonService(body, orderReturn?.id);
      dispatch(actions.deleteReturnReasonSuccess(res));
      handleToggleModal();
      setIsResultDispute(false);
      setIsDispute(false);
      dispatchAlert(
        openAlertMessage({
          message: 'Delete dispute reason successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.deleteReturnReasonFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete dispute reason fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    if (result && ['REJECTED_FULL_PAYMENT', 'REFUNDED_BOTH_PARTIES'].includes(result?.value)) {
      setIsShowAmount(true);
    } else {
      setValue('reimbursed_amount', 0);
      setIsShowAmount(false);
    }
  }, [result, setValue]);

  useEffect(() => {
    if (orderReturn?.dispute_status) {
      const selectedResult = RESULT_DISPUTE.find(
        (result) => result.value === orderReturn.dispute_result
      );
      orderReturn?.reimbursed_amount && setIsShowAmount(true);
      setValue('reimbursed_amount', orderReturn?.reimbursed_amount);
      setValue('dispute_id', orderReturn?.dispute_id);
      selectedResult &&
        setValue('result', {
          label: selectedResult.label,
          value: selectedResult.value
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(orderReturn), setValue]);

  return (
    <CardToggle
      title={
        <div className="flex items-center">
          <p className="mr-3">Dispute</p>
          <Status name={orderReturn?.dispute_status} />
        </div>
      }
      className="mt-2 grid w-full grid-cols-1 gap-2"
    >
      <form
        className="grid w-full grid-cols-1 gap-2"
        noValidate
        onSubmit={handleSubmit(onSubmitResult)}
      >
        <div>
          <Controller
            control={control}
            name="dispute_id"
            render={({ field }) => (
              <Input
                {...field}
                required
                placeholder="Enter Dispute ID"
                label="Dispute ID"
                name="dispute_id"
                disabled={Boolean(orderReturn?.dispute_result)}
                error={errors.dispute_id?.message}
              />
            )}
          />
        </div>
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
                disabled={Boolean(orderReturn?.dispute_result)}
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
                  disabled={Boolean(orderReturn?.dispute_result)}
                  error={errors.reimbursed_amount?.message}
                  className="pl-6"
                  startIcon={
                    <span
                      className={`${
                        Boolean(orderReturn?.dispute_result) &&
                        'text-lightSecondary dark:text-mistBlue'
                      }`}
                    >
                      $
                    </span>
                  }
                />
              )}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={isLoadingReturnReason || isLoadingReturnResult}
            className="mr-3 cursor-pointer text-xs text-redLight"
            onClick={handleToggleModal}
          >
            Delete dispute request
          </button>
          <div className="flex items-center">
            <Button
              disabled={isLoadingReturnReason || isLoadingReturnResult}
              className="mr-3 bg-primary500 text-white"
              type="button"
              onClick={onEditReason}
            >
              Edit reason
            </Button>
            <Button
              isLoading={isLoadingReturnResult}
              disabled={Boolean(orderReturn?.dispute_result) || isLoadingReturnResult}
              className="bg-primary500 text-white"
            >
              Submit dispute result
            </Button>
          </div>
        </div>
      </form>
      <ModalConfirmDeleteDispute
        openModal={openModal}
        handleToggleModal={handleToggleModal}
        onDeleteDispute={onDeleteDispute}
        isLoadingReturnReason={isLoadingReturnReason}
      />
    </CardToggle>
  );
}
