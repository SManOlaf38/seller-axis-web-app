import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import AlertIcon from 'public/alert.svg';

export default function ModalConfirmDeleteDispute({
  openModal,
  handleToggleModal,
  onDeleteDispute,
  isLoadingReturnReason
}: {
  openModal: boolean;
  isLoadingReturnReason: boolean;
  onDeleteDispute: () => Promise<void>;
  handleToggleModal: () => void;
}) {
  return (
    <Modal open={openModal} onClose={handleToggleModal}>
      <div className="flex flex-col items-center justify-center">
        <AlertIcon />
        <p className="my-4 flex text-center text-sm font-medium leading-6">
          Are you sure you want to delete dispute request?
        </p>
        <div className="flex w-full items-center justify-between">
          <Button
            onClick={handleToggleModal}
            disabled={isLoadingReturnReason}
            className="flex w-[48%] items-center justify-center bg-gey100 text-lightPrimary"
          >
            No
          </Button>
          <Button
            disabled={isLoadingReturnReason}
            isLoading={isLoadingReturnReason}
            className="flex w-[48%] items-center justify-center bg-paleRed text-paperLight"
            onClick={onDeleteDispute}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
