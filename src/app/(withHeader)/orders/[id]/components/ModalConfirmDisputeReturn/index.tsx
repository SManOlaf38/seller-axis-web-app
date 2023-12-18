import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { minDate } from '@/constants';
import AlertIcon from 'public/alert.svg';

export default function ModalConfirmDisputeReturn({
  open,
  onModalToggle,
  onConfirmDisputeReturn,
  isDispute,
  dateDispute,
  setDateDispute,
  isLoadingUpdateDispute
}: {
  open: boolean;
  isDispute: boolean;
  isLoadingUpdateDispute: boolean;
  onModalToggle: () => void;
  dateDispute: string;
  onConfirmDisputeReturn: () => Promise<void>;
  setDateDispute: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Modal open={open} onClose={onModalToggle}>
      <div className="flex flex-col items-center justify-center gap-4">
        <AlertIcon />
        <p className="flex text-center text-sm font-medium leading-6">
          {isDispute
            ? `Do you want to change to Undisputed?
The inventory will be updated once saved.`
            : `Do you want to change to Dispute? The inventory will be updated once saved. Please choose
dispute date if you want to change it.`}
        </p>
        {!isDispute && (
          <div className="w-full">
            <Input
              value={dateDispute}
              placeholder="Enter dispute date"
              min={minDate()}
              type="date"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDateDispute(e.target.value);
              }}
            />
          </div>
        )}

        <div className="flex items-center">
          <Button
            disabled={isLoadingUpdateDispute}
            onClick={onModalToggle}
            color="dark:bg-gunmetal bg-buttonLight"
          >
            Abort
          </Button>
          <Button
            isLoading={isLoadingUpdateDispute}
            disabled={isLoadingUpdateDispute}
            className="ml-2 bg-paleRed text-paperLight"
            onClick={() => onConfirmDisputeReturn()}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
