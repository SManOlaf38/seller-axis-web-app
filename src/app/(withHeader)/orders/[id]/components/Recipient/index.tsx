'use client';
import { useState } from 'react';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import IconEdit from 'public/edit.svg';
import IconRefresh from 'public/refresh.svg';
import IconVersion from 'public/version.svg';
import { InfoOrder } from '../../containers';
import type { Customer, ShipTo } from '../../../interface';

const Recipient = ({ shipTo, customer }: { shipTo: ShipTo | null; customer: Customer | null }) => {
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
              <Button className="bg-gey100 dark:bg-gunmetal" startIcon={<IconVersion />}>
                Verify Address
              </Button>
              <Button className="bg-gey100 dark:bg-gunmetal" startIcon={<IconRefresh />}>
                Revert
              </Button>
            </div>

            <InfoOrder
              title={'Customer'}
              value={
                <div>
                  <div>{customer?.name || '-'}</div>
                  <div>{customer?.address_1 || '-'}</div>
                  <div>{customer?.address_2 || '-'}</div>
                  <div>{customer?.city || '-'}</div>
                  <div>{customer?.state || '-'}</div>
                  <div>{customer?.postal_code || '-'}</div>
                  <div>{customer?.country || '-'}</div>
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
