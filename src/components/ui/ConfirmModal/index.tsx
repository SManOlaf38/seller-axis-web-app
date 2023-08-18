import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface IProp {
  onClose: () => void;
  open: boolean;
  title: string;
  description: string | React.ReactElement;
  onUpdate: () => void;
  onCreate: () => void;
  loading: boolean;
}
const ConfirmModal = ({
  open,
  onClose,
  onUpdate,
  onCreate,
  title,
  description,
  loading
}: IProp) => {
  return (
    <Modal title={title} onClose={onClose} open={open} isClose>
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">{description}</p>
        <div className="flex gap-2">
          <Button
            isLoading={loading}
            disabled={loading}
            className="flex w-1/2 items-center justify-center text-center"
            color="bg-dodgerBlue text-white"
            onClick={onUpdate}
            type="button"
          >
            <p>Update</p>
          </Button>

          <Button
            isLoading={loading}
            disabled={loading}
            className="flex w-1/2 items-center justify-center text-center"
            color="bg-dodgerBlue text-white"
            onClick={onCreate}
            type="button"
          >
            <p>Create new</p>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
