import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import AlertIcon from 'public/alert.svg';
import type { ShipmentPackages } from '../../../interface';

export default function ModalConfirmVoid({
  openModal,
  itemVoid,
  isLoadingVoidShip,
  onVoidShip,
  handleCloseModal
}: {
  openModal: boolean;
  itemVoid: ShipmentPackages[] | null;
  isLoadingVoidShip: boolean;
  onVoidShip: (listItemShipment: ShipmentPackages[]) => Promise<void>;
  handleCloseModal: () => void;
}) {
  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <div className="flex flex-col items-center justify-center">
        <AlertIcon />
        <p className="my-4 flex text-center text-sm font-medium leading-6">
          Once you void this Tracking Number, all related information will be voided. Are you sure
          you want to proceed?
        </p>
        <div className="flex w-full items-center justify-between">
          <Button
            disabled={isLoadingVoidShip}
            onClick={handleCloseModal}
            className="flex w-[48%] items-center justify-center bg-gey100 text-lightPrimary"
          >
            No
          </Button>
          <Button
            isLoading={isLoadingVoidShip}
            disabled={isLoadingVoidShip}
            className="flex w-[48%] items-center justify-center bg-paleRed text-paperLight"
            onClick={() => onVoidShip(itemVoid as ShipmentPackages[])}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
