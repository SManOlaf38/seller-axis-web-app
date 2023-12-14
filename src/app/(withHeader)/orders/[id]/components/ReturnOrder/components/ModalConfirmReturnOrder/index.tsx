import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import AlertIcon from 'public/alert.svg';

export default function ModalConfirmReturnOrder({
  open,
  onModalToggle,
  onConfirmReturnOrder,
  isLoadingCreateReturnNote
}: {
  open: boolean;
  isLoadingCreateReturnNote: boolean;
  onModalToggle: () => void;
  onConfirmReturnOrder: () => Promise<void>;
}) {
  return (
    <Modal open={open} onClose={onModalToggle}>
      <div className="flex flex-col items-center justify-center gap-4">
        <AlertIcon />
        <p className="flex text-center text-sm font-medium leading-6">
          Important: This action is final, and cannot be reversed or altered. Carefully review all
          information associated with this action before submitting or saving it.
        </p>
        <div className="flex items-center">
          <Button
            disabled={isLoadingCreateReturnNote}
            onClick={onModalToggle}
            color="dark:bg-gunmetal bg-buttonLight"
          >
            Abort
          </Button>
          <Button
            isLoading={isLoadingCreateReturnNote}
            disabled={isLoadingCreateReturnNote}
            className="ml-2 bg-paleRed text-paperLight"
            onClick={() => onConfirmReturnOrder()}
          >
            Submit return order
          </Button>
        </div>
      </div>
    </Modal>
  );
}
