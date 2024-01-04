import dayjs from 'dayjs';
import Image from 'next/image';

import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../InfoOrder';
import Icons from '@/components/Icons';
import { SHIP_METHOD } from '@/constants';
import Tooltip from '@/components/ui/Tooltip';

import type { Order, OrderHistory } from '../../../interface';
import { convertFormatDateHaveTime } from '@/utils/utils';

const General = ({ orderDate, detail }: { orderDate: string; detail: Order }) => {
  return (
    <CardToggle
      iconTitle={<Icons glyph="intersect" />}
      title="General"
      className="grid w-full grid-cols-1"
    >
      <InfoOrder title={'Retailer'} value={detail?.batch?.retailer?.name || '-'} />
      <InfoOrder
        title={
          <div className="flex items-center">
            <p className="mr-1">Order Status</p>
            <Tooltip
              classNameContent="max-w-[350px] max-h-[260px] overflow-y-auto px-3"
              content={
                <>
                  <span className="pb-2 text-xs font-semibold text-lightPrimary dark:text-neutralLight">
                    Status history:
                  </span>
                  {detail?.order_history?.map((item: OrderHistory, index: number) => (
                    <div className="py-2" key={index}>
                      <p className="text-xs text-santaGrey">
                        {item?.status_day
                          ? convertFormatDateHaveTime(item?.status_day)
                          : '-'}
                      </p>
                      <div className="mt-1 flex items-center">
                        <div className="flex items-center pr-3">
                          <Image
                            src={item?.user?.avatar || '/userAccount.svg'}
                            width={16}
                            height={16}
                            alt="Picture of the author"
                          />
                          <p className="ml-1 text-xs font-semibold text-lightPrimary dark:text-neutralLight">
                            {item?.user
                              ? `${item?.user?.first_name} ${item?.user?.last_name}`
                              : '-'}
                          </p>
                        </div>
                        <p className="text-xs text-lightPrimary dark:text-neutralLight">
                          . {item?.order_status}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              }
            >
              <Icons glyph="exclamation" />
            </Tooltip>
          </div>
        }
        value={detail?.status || '-'}
      />
      <InfoOrder title={'Order Date'} value={dayjs(orderDate).format('MM/DD/YYYY')} />
      <InfoOrder
        title={'Shipping Method'}
        value={
          detail?.shipping_code
            ? ((matchingMethod) => matchingMethod?.label)(
                SHIP_METHOD.find((method) => method?.value === detail.shipping_code)
              )
            : '-'
        }
      />
      <InfoOrder title={'Shipment Expectation'} value={'-'} />
      <InfoOrder title={'Customer Order Number'} value={detail?.cust_order_number} />
      <InfoOrder title={'Paid Date'} value={'-'} />
      <InfoOrder
        title={'Ship By'}
        value={
          detail?.estimated_ship_date
            ? dayjs(detail?.estimated_ship_date).format('MM/DD/YYYY')
            : '-'
        }
      />
      <InfoOrder className="border-none" title={'Hold Until'} value={'-'} />
    </CardToggle>
  );
};

export default General;
