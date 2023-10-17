import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Order } from '../../../interface';
import { ORDER_STATUS } from '@/constants';

interface SubmitInvoice {
  handleGetInvoice: () => Promise<void>;
  isLoading: boolean;
  orderDetail: Order;
}

const SubmitInvoice = ({ handleGetInvoice, isLoading, orderDetail }: SubmitInvoice) => {
  return (
    <CardToggle title="Submit Invoice" className="grid w-full grid-cols-1 gap-2">
      <div className="flex items-center">
        <p className="font-medium text-santaGrey">Doc Number: </p>
        <p className="ml-1 font-normal">{orderDetail?.invoice_order?.doc_number || '-'}</p>
      </div>
      <div className="my-4 flex flex-col items-end">
        <Button
          disabled={
            isLoading ||
            [
              ORDER_STATUS.Opened,
              ORDER_STATUS.Acknowledged,
              ORDER_STATUS['Bypassed Acknowledge'],
              ORDER_STATUS.Backorder,
              ORDER_STATUS.Shipped,
              ORDER_STATUS['Invoice Confirmed'],
              ORDER_STATUS.Cancelled
            ].includes(orderDetail?.status) ||
            (orderDetail?.status_history.includes(ORDER_STATUS['Invoice Confirmed']) &&
              [ORDER_STATUS['Shipment Confirmed']].includes(orderDetail?.status))
          }
          isLoading={isLoading}
          className="bg-primary500 text-white"
          onClick={handleGetInvoice}
        >
          Submit invoice
        </Button>
      </div>
    </CardToggle>
  );
};

export default SubmitInvoice;
