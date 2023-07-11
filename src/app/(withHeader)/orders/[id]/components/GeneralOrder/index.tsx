'use client';
import CardToggle from '@/components/ui/CardToggle';

import dayjs from 'dayjs';
import { InfoOrder, headerTableWarehouse } from '../../containers';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import IconEdit from 'public/edit.svg';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import IconVersion from 'public/version.svg';
import IconRefresh from 'public/refresh.svg';

const GeneralOrder = () => {
  const [isEditRecipient, setIsEditRecipient] = useState(false);

  const handleToggle = () => {
    setIsEditRecipient((isEditRecipient) => !isEditRecipient);
  };

  const renderBodyTable = []?.map((row: any, index: number) => ({
    orderItem: '-',
    uniCost: '-',
    qty: '-',
    total: '-'
  }));

  return (
    <div className="grid w-full grid-cols-1 gap-2">
      <CardToggle title="General" className="grid w-full grid-cols-1">
        <InfoOrder title={'Order Date'} value={dayjs(new Date()).format('YYYY-MM-DD')} />
        <InfoOrder title={'Paid Date'} value={dayjs(new Date()).format('YYYY-MM-DD')} />
        <InfoOrder title={'Ship By'} value={dayjs(new Date()).format('YYYY-MM-DD')} />
        <InfoOrder
          className="border-none"
          title={'Hold Until'}
          value={dayjs(new Date()).format('YYYY-MM-DD')}
        />
      </CardToggle>

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
                    <div>Lisa Smith</div>
                    <div>15 West Loop South</div>
                    <div>Houston</div>
                    <div>TX</div>
                    <div>77027</div>
                  </div>
                }
              />
              <div className="flex items-center justify-end gap-4">
                <Button className="dark:bg-gunmetal bg-gey100" startIcon={<IconVersion />}>
                  Verify Address
                </Button>
                <Button className="dark:bg-gunmetal bg-gey100" startIcon={<IconRefresh />}>
                  Revert
                </Button>
              </div>
              <InfoOrder title={'Phone'} value="555-555-5555" />
              <InfoOrder
                className="border-none"
                title={'Tax Information'}
                value={dayjs(new Date()).format('YYYY-MM-DD')}
              />
            </>
          )}
        </div>
        <div className="mt-4 flex items-center justify-end gap-4">
          {isEditRecipient ? (
            <>
              <Button onClick={handleToggle} className="dark:bg-gunmetal bg-gey100">
                Cancel
              </Button>
              <Button onClick={handleToggle} className="bg-primary500">
                Save
              </Button>
            </>
          ) : (
            <Button onClick={handleToggle} className="dark:bg-gunmetal bg-gey100" startIcon={<IconEdit />}>
              Edit
            </Button>
          )}
        </div>
      </CardToggle>

      <CardToggle title="Cost" className="grid w-full grid-cols-1 gap-1">
        <InfoOrder title={'Product'} value={`$ ${140} `} />
        <InfoOrder title={'Shipping'} value={`$ ${140} `} />
        <InfoOrder title={'Tax'} value={`$ ${140} `} />
        <InfoOrder className="border-none" title={'Total paid'} value={`$ ${140} `} />
      </CardToggle>

      <CardToggle title="Order Items" className="grid w-full grid-cols-1 gap-2">
        <Table
          columns={headerTableWarehouse}
          loading={false}
          rows={renderBodyTable}
          totalCount={0}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={10}
          pageSize={10}
        />
      </CardToggle>
    </div>
  );
};

export default GeneralOrder;
