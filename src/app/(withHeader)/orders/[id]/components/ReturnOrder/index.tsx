import { Dispatch, SetStateAction, useState } from 'react';

import { useStore } from '@/app/(withHeader)/orders/context';
import { Button } from '@/components/ui/Button';
import General from '../General';
import CardToggle from '@/components/ui/CardToggle';
import Autocomplete from '@/components/ui/Autocomplete';
import { Options } from '@/app/(withHeader)/orders/containers';
import SectionOrderReturn from './components/SectionOrderReturn';

import type {
  ListRetailerWarehouse,
  RetailerWarehouse
} from '@/app/(withHeader)/warehouse/interface';
import ModalConfirmReturnOrder from './components/ModalConfirmReturnOrder';
import useToggleModal from '@/hooks/useToggleModal';
import Icons from '@/components/Icons';

type ReturnOrder = {
  setIsReturnOrder: Dispatch<SetStateAction<boolean>>;
  dataRetailerWarehouse: ListRetailerWarehouse;
  listOrderReturn: never[];
};

export default function ReturnOrder(props: ReturnOrder) {
  const { setIsReturnOrder, dataRetailerWarehouse, listOrderReturn } = props;
  const {
    state: { orderDetail }
  } = useStore();
  const { openModal, handleToggleModal } = useToggleModal();

  const [valueWarehouse, setValueWarehouse] = useState<{
    warehouse: Options | null;
  }>({
    warehouse: null
  });

  const handleChangeWarehouse = (value: Options) => {
    setValueWarehouse({
      warehouse: value
    });
  };

  const onCancelReturnOrder = () => {
    setIsReturnOrder(false);
  };

  const onConfirmReturnOrder = async () => {};

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="my-4 text-lg font-semibold">Purchase Order: #{orderDetail.po_number}</h2>
        <div className="flex items-center gap-2">
          <Button className="bg-gey100 dark:bg-gunmetal" onClick={onCancelReturnOrder}>
            Cancel
          </Button>
          <Button className="bg-primary500 text-white" onClick={handleToggleModal}>
            Save
          </Button>
        </div>
      </div>
      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <SectionOrderReturn listOrderReturn={listOrderReturn} />
          </div>
          <div className="flex flex-col gap-2">
            <General detail={orderDetail} orderDate={orderDetail.order_date} />
            <CardToggle
              iconTitle={<Icons glyph="intersect" />}
              title="Configure Return Shipment"
              className="grid w-full grid-cols-1 gap-2"
            >
              <Autocomplete
                options={
                  dataRetailerWarehouse?.results?.map((item: RetailerWarehouse) => ({
                    value: item?.id,
                    label: item?.name
                  })) || []
                }
                required
                label="Return to"
                name="warehouse"
                placeholder="Select Retailer Warehouse"
                value={valueWarehouse.warehouse}
                pathRedirect="/warehouse/create"
                onChange={(value: Options) => handleChangeWarehouse(value)}
              />
            </CardToggle>
          </div>
        </div>
      </div>
      <ModalConfirmReturnOrder
        open={openModal}
        onModalToggle={handleToggleModal}
        onConfirmReturnOrder={onConfirmReturnOrder}
      />
    </>
  );
}
