import dayjs from 'dayjs';

import CardToggle from '@/components/ui/CardToggle';
import { Order } from '../../../interface';
import { InfoOrder } from '../InfoOrder';
import Icons from '@/components/Icons';
import { SHIP_METHOD } from '@/constants';

const General = ({ orderDate, detail }: { orderDate: string; detail: Order }) => {
  return (
    <CardToggle
      iconTitle={<Icons glyph="intersect" />}
      title="General"
      className="grid w-full grid-cols-1"
    >
      <InfoOrder title={'Retailer'} value={detail?.batch?.retailer?.name || '-'} />
      <InfoOrder title={'Order Status'} value={detail?.status || '-'} />
      <InfoOrder title={'Order Date'} value={dayjs(orderDate).format('MM/DD/YYYY')} />
      <InfoOrder
        title={'Shipping Method'}
        value={detail?.items
          ?.map((item) => {
            const matchingMethod = SHIP_METHOD.find(
              (method) => method?.value === item?.shipping_code
            );
            return matchingMethod ? matchingMethod?.label : '-';
          })
          .join(', ')}
      />
      <InfoOrder title={'Shipment Expectation'} value={'-'} />
      <InfoOrder title={'Customer Order Number'} value={detail?.cust_order_number} />
      <InfoOrder title={'Paid Date'} value={'-'} />
      <InfoOrder title={'Ship By'} value={'-'} />
      <InfoOrder className="border-none" title={'Hold Until'} value={'-'} />
    </CardToggle>
  );
};

export default General;
