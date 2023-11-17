import clsx from 'clsx';
import type { ItemOrderItemPack, ItemTableAddBox } from '@/app/(withHeader)/orders/interface';

export default function ColumnQuantity({
  dataTableEditPack
}: {
  dataTableEditPack: ItemTableAddBox | null;
}) {
  return (
    <td className="whitespace-nowrap border-r border-lightLine px-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
      <table className="w-full">
        <tbody>
          {dataTableEditPack?.order_item_packages ? (
            <>
              {dataTableEditPack?.order_item_packages?.map(
                (item: ItemOrderItemPack, indexChildren: number) => (
                  <tr key={indexChildren}>
                    <td
                      className={clsx('border-b border-lightLine py-2 dark:border-iridium', {
                        'border-none':
                          indexChildren === dataTableEditPack?.order_item_packages.length - 1
                      })}
                    >
                      {item?.qty_ordered || '-'}{' '}
                      <span className="text-xs text-primary500">
                        (x
                        {item?.sku_quantity || '-'})
                      </span>
                    </td>
                  </tr>
                )
              )}
            </>
          ) : (
            <tr>
              <td className="border-b border-lightLine py-2 dark:border-iridium">
                <p>-</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </td>
  );
}
