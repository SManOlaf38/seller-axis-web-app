import Link from 'next/link';
import dayjs from 'dayjs';
import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../../containers';
import { Order } from '../../../interface';

const General = ({ orderDate, detail }: { orderDate: string; detail: Order }) => {
  return (
    <CardToggle title="General" className="grid w-full grid-cols-1">
      <InfoOrder title={'Retailer'} value={detail?.batch?.retailer?.name || '-'} />
      <InfoOrder
        title={'Tracking number'}
        value={
          <>
            {detail?.shipments?.length > 0
              ? detail?.shipments.map((item) => (
                  <Link
                    key={item?.tracking_number}
                    href={`${item.package_document}`}
                    passHref
                    legacyBehavior
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-dodgeBlue underline "
                    >
                      {item.tracking_number}
                    </a>
                  </Link>
                ))
              : '-'}
          </>
        }
      />
      <InfoOrder title={'Order Date'} value={dayjs(orderDate).format('YYYY-MM-DD')} />
      <InfoOrder title={'Paid Date'} value={'-'} />
      <InfoOrder title={'Ship By'} value={'-'} />
      <InfoOrder className="border-none" title={'Hold Until'} value={'-'} />
    </CardToggle>
  );
};

export default General;
