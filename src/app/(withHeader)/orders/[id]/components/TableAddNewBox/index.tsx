import { useMemo } from 'react';

import ColumnAction from './components/ColumnAction';
import ColumnQuantity from './components/ColumnQuantity';
import ColumnSku from './components/ColumnSku';

import type { ItemOrderItemPack, ItemTableAddBox } from '../../../interface';

type TypeTableAddNewBox = {
  columns: {
    id: string;
    label: string;
  }[];
  skuQuantity?: number;
  dataTableEditPack: ItemTableAddBox | null;
  handleEditBox: (item: ItemTableAddBox, orderItemPack: ItemOrderItemPack) => void;
  handleDeleteBox: (idBox: number) => void;
};

export default function TableAddNewBox({
  columns,
  dataTableEditPack,
  skuQuantity,
  handleEditBox,
  handleDeleteBox
}: TypeTableAddNewBox) {
  return (
    <div className="custom_header_light dark:header_cus flex-col rounded-lg border">
      <div className="max-h-[410px] overflow-x-auto overflow-y-auto">
        <div className="inline-block w-full align-middle">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead className="bg-neutralLight dark:bg-gunmetal">
                <tr>
                  {columns?.map((column: { id: string; label: string }) => (
                    <th
                      className="text-centerfont-semibold border-b border-r border-lightLine px-[16px] py-[8px] capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey"
                      key={column.id}
                    >
                      <p className="text-[11px]">{column.label}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-lightLine bg-paperLight dark:divide-iridium dark:bg-darkGreen">
                {dataTableEditPack && (
                  <tr>
                    <td className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                      <div>
                        {dataTableEditPack?.box?.name || '-'}{' '}
                        <span className="text-xs text-primary500">
                          ({skuQuantity || '-'} / {dataTableEditPack?.box?.box_max_quantity || '-'})
                        </span>
                      </div>
                    </td>
                    <ColumnSku dataTableEditPack={dataTableEditPack} />
                    <ColumnQuantity dataTableEditPack={dataTableEditPack} />
                    <ColumnAction
                      dataTableEditPack={dataTableEditPack}
                      handleEditBox={handleEditBox}
                      handleDeleteBox={handleDeleteBox}
                    />
                  </tr>
                )}
              </tbody>
            </table>

            {!dataTableEditPack && (
              <div className="flex w-full items-center justify-center bg-paperLight py-10 dark:bg-darkGreen">
                No Data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
