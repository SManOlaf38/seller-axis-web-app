'use client';

import { useState } from 'react';

import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import CardToggle from '@/components/ui/CardToggle';
import { getOrderDetailServer, revertAddressService, updateShipFromService } from '../../../fetch';
import type { Order, UpdateShipTo } from '../../../interface';
import ShipFromComponent from './ShipFrom';
import ShipToRecipient from './ShipTo';

const Recipient = ({
  isLoadingVerify,
  onVerifyAddress,
  detail,
  isLoadingUpdateShipTo,
  onUpdateShipTo,
  isLoadingRevert,
  retailerCarrier,
  isResidential
}: {
  onVerifyAddress: () => Promise<void>;
  isLoadingVerify: boolean;
  isLoadingRevert: boolean;
  isResidential: boolean;
  detail: Order;
  isLoadingUpdateShipTo: boolean;
  onUpdateShipTo: (data: UpdateShipTo, callback: () => void) => Promise<void>;
  retailerCarrier: {
    label: string;
    service: number | string;
    value: number | string;
  };
}) => {
  const { dispatch } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const [isEditRecipient, setIsEditRecipient] = useState<{
    shipFrom: boolean;
    shipTo: boolean;
  }>({
    shipFrom: false,
    shipTo: false
  });

  const handleToggleEdit = (name: 'shipFrom' | 'shipTo') => {
    setIsEditRecipient({
      ...isEditRecipient,
      [name]: !isEditRecipient[name]
    });
  };

  const handleRevertAddress = async () => {
    try {
      dispatch(actions.revertAddressRequest());
      const res = await revertAddressService(+detail?.id, {
        carrier_id: detail?.batch.retailer.default_carrier?.id as never,
        ...detail?.verified_ship_to,
        status: 'UNVERIFIED'
      });

      dispatch(actions.revertAddressSuccess(res));
      dispatchAlert(
        openAlertMessage({
          message: 'Revert successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.revertAddressFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Revert Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetOrderDetail = async () => {
    const dataOrder = await getOrderDetailServer(+detail?.id);
    dispatch(actions.setOrderDetail(dataOrder));
  };

  const handleRevertAddressShipFrom = async (data: any) => {
    try {
      dispatch(actions.revertShipFromAddressRequest());
      await updateShipFromService(+detail?.id, {
        ...data,
        status: 'UNVERIFIED'
      });
      dispatch(actions.revertShipFromAddressSuccess());
      handleGetOrderDetail();
      dispatchAlert(
        openAlertMessage({
          message: 'Revert successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.revertShipFromAddressFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Revert Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  return (
    <CardToggle title="Recipient" className="grid w-full grid-cols-1 gap-2">
      <div className="grid w-full grid-cols-1 gap-2">
        <div className="grid w-full grid-cols-1 justify-between gap-2 lg:grid-cols-2">
          <ShipFromComponent
            isEditRecipient={isEditRecipient}
            isLoadingVerify={isLoadingRevert}
            handleToggleEdit={handleToggleEdit}
            detail={detail}
            isLoadingUpdateShipTo={isLoadingUpdateShipTo}
            handleGetOrderDetail={handleGetOrderDetail}
            handleRevertAddressShipFrom={handleRevertAddressShipFrom}
            dispatch={dispatch}
          />

          <ShipToRecipient
            isResidential={isResidential}
            retailerCarrier={retailerCarrier}
            onVerifyAddress={onVerifyAddress}
            detail={detail}
            isEditRecipient={isEditRecipient}
            isLoadingVerify={isLoadingVerify}
            handleRevertAddress={handleRevertAddress}
            handleToggleEdit={handleToggleEdit}
            isLoadingUpdateShipTo={isLoadingUpdateShipTo}
            onUpdateShipTo={onUpdateShipTo}
          />
        </div>
      </div>
    </CardToggle>
  );
};

export default Recipient;
