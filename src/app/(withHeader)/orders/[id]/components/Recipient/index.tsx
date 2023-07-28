'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import IconEdit from 'public/edit.svg';
import IconRefresh from 'public/refresh.svg';
import IconVersion from 'public/version.svg';
import { InfoOrder } from '../../containers';
import type { Customer, Order, ShipTo } from '../../../interface';
import IconHome from 'public/Home.svg';

const Recipient = ({
  shipTo,
  customer,
  billTo,
  onVerifyAddress,
  isLoadingVerify,
  detail,
  onRevertAddress
}: {
  shipTo: ShipTo | null;
  customer: Customer | null;
  billTo: ShipTo | null;
  onVerifyAddress: () => Promise<void>;
  isLoadingVerify: boolean;
  detail: Order;
  onRevertAddress: () => Promise<void>;
}) => {
  const [isEditRecipient, setIsEditRecipient] = useState(false);

  const handleToggle = () => {
    setIsEditRecipient((isEditRecipient) => !isEditRecipient);
  };

  return (
    <CardToggle title="Recipient" className="grid w-full grid-cols-1 gap-2">
      <div className="grid w-full grid-cols-1 gap-2">
        {isEditRecipient ? (
          <>
            <Input label="Name" />
            <Input label="Country" />
            <Input label="Address Line 1" />
            <Input label="Address Line 2" />
            <Input label="City" />
            <Input label="State" />
            <Input label="Phone" />
          </>
        ) : (
          <>
            <InfoOrder
              title={'Ship To'}
              value={
                <div>
                  <div>{shipTo?.name || '-'}</div>
                  <div>{shipTo?.address_1 || '-'}</div>
                  <div>{shipTo?.address_2 || '-'}</div>
                  <div>{shipTo?.city || '-'}</div>
                  <div>{shipTo?.state || '-'}</div>
                  <div>{shipTo?.postal_code || '-'}</div>
                  <div>{shipTo?.country || '-'}</div>
                  <div>{shipTo?.day_phone || '-'}</div>
                </div>
              }
            />
            <div className="flex items-center justify-end gap-4">
              {detail?.verified_ship_to?.id ? (
                <span className="text-sm text-[#6CFF8D]"> Address Validated</span>
              ) : (
                <Button
                  onClick={onVerifyAddress}
                  className="bg-gey100 dark:bg-gunmetal"
                  isLoading={isLoadingVerify}
                  disabled={isLoadingVerify}
                >
                  Verify Address
                </Button>
              )}
              {detail?.verified_ship_to?.id && (
                <Button
                  onClick={onRevertAddress}
                  className="bg-gey100 dark:bg-gunmetal"
                  isLoading={isLoadingVerify}
                  disabled={isLoadingVerify}
                >
                  Revert
                </Button>
              )}
            </div>

            <InfoOrder
              title={'Customer'}
              value={
                <div>
                  <div>{customer?.name || billTo?.name || ''}</div>
                  <div>{customer?.address_1 || billTo?.address_1 || '-'}</div>
                  <div>{customer?.address_2 || billTo?.address_2 || '-'}</div>
                  <div>{customer?.city || billTo?.city || '-'}</div>
                  <div>{customer?.state || billTo?.state || '-'}</div>
                  <div>{customer?.postal_code || billTo?.postal_code || '-'}</div>
                  <div>{customer?.country || billTo?.country || '-'}</div>
                </div>
              }
            />
          </>
        )}
      </div>
      <div className="mt-4 flex items-center justify-end gap-4">
        {isEditRecipient ? (
          <>
            <Button onClick={handleToggle} className="bg-gey100 dark:bg-gunmetal">
              Cancel
            </Button>
            <Button onClick={handleToggle} className="bg-primary500">
              Save
            </Button>
          </>
        ) : (
          <Button
            onClick={handleToggle}
            className="bg-gey100 dark:bg-gunmetal"
            startIcon={<IconEdit />}
          >
            Edit
          </Button>
        )}
      </div>
    </CardToggle>
  );
};

export default Recipient;
