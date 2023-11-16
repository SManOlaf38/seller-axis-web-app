import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import AlertIcon from 'public/alert.svg';

export default function ModalConfirmDeleteBox({
  openModal,
  handleConfirmDeleteTable,
  handleCloseModal
}: {
  openModal: boolean;
  handleConfirmDeleteTable: () => void;
  handleCloseModal: () => void;
}) {
  return (
    <Modal width="w-[560px]" open={openModal} onClose={handleCloseModal}>
      <div className="flex flex-col items-center justify-center">
        <AlertIcon />
        <p className="my-4 flex text-center text-sm font-medium leading-6">
          Are you sure you want to change this box, all items previously added to the box will be
          removed?
        </p>
        <div className="flex w-full items-center justify-between">
          <Button
            onClick={handleCloseModal}
            className="flex w-[48%] items-center justify-center bg-gey100 text-lightPrimary"
          >
            No
          </Button>
          <Button
            className="flex w-[48%] items-center justify-center bg-paleRed text-paperLight"
            onClick={handleConfirmDeleteTable}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
