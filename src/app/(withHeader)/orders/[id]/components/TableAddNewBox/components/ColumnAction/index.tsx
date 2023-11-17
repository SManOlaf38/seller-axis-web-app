import clsx from 'clsx';

import DeleteIcon from 'public/delete.svg';
import IconAction from 'public/three-dots.svg';
import PenIcon from '/public/pencil.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';

import type { ItemOrderItemPack, ItemTableAddBox } from '@/app/(withHeader)/orders/interface';

type TypeTBodyAction = {
  dataTableEditPack: ItemTableAddBox | null;
  handleEditBox: (item: ItemTableAddBox, orderItemPack: ItemOrderItemPack) => void;
  handleDeleteBox: (idBox: number) => void;
};

export default function ColumnAction({
  dataTableEditPack,
  handleEditBox,
  handleDeleteBox
}: TypeTBodyAction) {
  const handleEditRow = (row: ItemTableAddBox, orderItemPack: ItemOrderItemPack) => {
    handleEditBox && handleEditBox(row, orderItemPack);
  };

  const handleDeleteRow = async (id: number) => {
    handleDeleteBox && handleDeleteBox(id);
  };

  return (
    <td className="whitespace-nowrap border-r border-lightLine px-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
      <table className="w-full">
        <tbody>
          {dataTableEditPack?.order_item_packages?.map(
            (item: ItemOrderItemPack, indexChildren: number) => (
              <tr key={indexChildren}>
                <td
                  className={clsx('border-b border-lightLine py-2 dark:border-iridium', {
                    'border-none':
                      indexChildren === dataTableEditPack?.order_item_packages.length - 1
                  })}
                >
                  <div
                    className="flex items-center justify-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Dropdown
                      classButton="justify-center"
                      mainMenu={<IconAction />}
                      className="fixed right-[27px] top-[-50px] w-[100px] dark:bg-gunmetal"
                    >
                      <div className="z-50 m-auto rounded-lg">
                        <Button
                          type="button"
                          onClick={() => handleEditRow(dataTableEditPack, item)}
                        >
                          <PenIcon />
                          <span className="items-start text-lightPrimary dark:text-santaGrey">
                            Edit
                          </span>
                        </Button>
                        <Button type="button" onClick={() => handleDeleteRow(item?.idSku)}>
                          <DeleteIcon />
                          <span className="items-start text-lightPrimary dark:text-santaGrey">
                            Delete
                          </span>
                        </Button>
                      </div>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </td>
  );
}
