import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Order } from '../../../interface';

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
            orderDetail?.status === 'Invoiced' ||
            orderDetail?.status === 'Opened' ||
            orderDetail?.status === 'Acknowledged' ||
            orderDetail?.status === 'Invoice Confirmed' ||
            orderDetail?.status === 'Cancelled' ||
            orderDetail?.status === 'Bypassed Acknowledge'
          }
          isLoading={isLoading}
          className="bg-primary500"
          onClick={handleGetInvoice}
        >
          Submit invoice
        </Button>
      </div>
    </CardToggle>
  );
};

export default SubmitInvoice;
