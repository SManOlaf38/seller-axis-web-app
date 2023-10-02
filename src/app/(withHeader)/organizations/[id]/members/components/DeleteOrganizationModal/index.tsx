import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import AlertIcon from 'public/alert.svg';

export default function DeleteOrganizationModal({
  open,
  onModalToggle,
  handleOrganizationDelete,
  isLoading
}: {
  open: boolean;
  onModalToggle: () => void;
  handleOrganizationDelete: () => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <Modal open={open} onClose={onModalToggle} className="max-w-[328px]">
      <div className="flex flex-col items-center justify-center">
        <AlertIcon />
        <p className="my-4 flex text-center text-sm font-medium leading-6">
          Once you delete this organization, all related orders and information will be permanently
          removed. Are you sure you want to proceed?
        </p>
        <div className="flex w-full items-center justify-between">
          <Button
            disabled={isLoading}
            onClick={onModalToggle}
            className="flex w-[48%] items-center justify-center bg-gey100 text-lightPrimary"
          >
            Cancel
          </Button>
          <Button
            className="flex w-[48%] items-center justify-center bg-paleRed text-paperLight"
            disabled={isLoading}
            isLoading={isLoading}
            onClick={() => handleOrganizationDelete()}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
