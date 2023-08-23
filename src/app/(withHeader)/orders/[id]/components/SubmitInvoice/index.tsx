import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Order } from '../../../interface';
import { Input } from '@/components/ui/Input';

interface SubmitInvoice {
  onInvoice: (token: string) => void;
  handleGetInvoice: () => Promise<void>;
  isLoading: boolean;
  realm_id: string | null;
  access_token_invoice?: string;
  orderDetail: Order;
}

const SubmitInvoice = ({
  onInvoice,
  handleGetInvoice,
  isLoading,
  realm_id,
  access_token_invoice,
  orderDetail
}: SubmitInvoice) => {
  return (
    <CardToggle title="Submit Invoice" className="grid w-full grid-cols-1 gap-2">
      {orderDetail?.status !== 'Invoiced' && (
        <Input label="Invoice number" disabled value={realm_id || ''} />
      )}
      <div className="my-4 flex flex-col items-end">
        <Button
          disabled={
            isLoading ||
            orderDetail?.status === 'Invoiced' ||
            orderDetail?.status === 'Opened' ||
            orderDetail?.status === 'Acknowledged' ||
            orderDetail?.status === 'Invoice Confirmed' ||
            orderDetail?.status === 'Cancelled'
          }
          isLoading={isLoading}
          className="bg-primary500"
          onClick={
            realm_id && access_token_invoice
              ? () => onInvoice(access_token_invoice as never)
              : handleGetInvoice
          }
        >
          {realm_id && access_token_invoice ? 'Submit invoice' : 'Get invoice'}
        </Button>
      </div>
    </CardToggle>
  );
};

export default SubmitInvoice;
