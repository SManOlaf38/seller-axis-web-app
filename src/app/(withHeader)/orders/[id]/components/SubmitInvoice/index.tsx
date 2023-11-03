import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Order } from '../../../interface';
import { ORDER_STATUS } from '@/constants';
import { useMemo } from 'react';

interface SubmitInvoice {
  handleGetInvoice: (on_invoice: string) => Promise<void>;
  isLoading: boolean;
  orderDetail: Order;
}

const SubmitInvoice = ({ handleGetInvoice, isLoading, orderDetail }: SubmitInvoice) => {
  const isStatusBtnSubmitInvoice = useMemo(() => {
    return (
      [
        ORDER_STATUS.Opened,
        ORDER_STATUS.Acknowledged,
        ORDER_STATUS['Bypassed Acknowledge'],
        ORDER_STATUS.Backorder,
        ORDER_STATUS['Invoice Confirmed'],
        ORDER_STATUS.Invoiced,
        ORDER_STATUS.Cancelled,
        ORDER_STATUS['Partly Shipped'],
        ORDER_STATUS['Partly Shipped Confirmed']
      ]?.includes(orderDetail?.status) ||
      (orderDetail?.status_history?.includes(ORDER_STATUS['Partly Shipped']) &&
        [ORDER_STATUS['Invoice Confirmed']]?.includes(orderDetail?.status)) ||
      (orderDetail?.status_history?.includes(ORDER_STATUS['Partly Shipped Confirmed']) &&
        [ORDER_STATUS.Invoiced]?.includes(orderDetail?.status))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(orderDetail?.status), JSON.stringify(orderDetail?.status_history)]);

  return (
    <CardToggle title="Submit Invoice" className="grid w-full grid-cols-1 gap-2">
      <div className="flex items-center">
        <p className="font-medium text-santaGrey">Doc Number: </p>
        <p className="ml-1 font-normal">{orderDetail?.invoice_order?.doc_number || '-'}</p>
      </div>
      <div className="my-4 flex flex-col items-end">
        <Button
          disabled={isLoading || isStatusBtnSubmitInvoice}
          isLoading={isLoading}
          className="bg-primary500 text-white"
          onClick={() => handleGetInvoice('on_invoice')}
        >
          Submit invoice
        </Button>
      </div>
    </CardToggle>
  );
};

export default SubmitInvoice;
