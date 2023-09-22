import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';

import { useStore } from '@/app/(withHeader)/retailers/context';
import IconArrowDown from 'public/dropdown-icon.svg';
import { Dropdown } from '@/components/ui/Dropdown';
import { ReferenceKey } from '../../constants';
import { ShipRefType } from '../../interface';

export const SelectReference = ({
  keyRef,
  valueReference,
  setValueReference
}: {
  keyRef: ReferenceKey;
  valueReference: ShipRefType;
  setValueReference: Dispatch<SetStateAction<ShipRefType>>;
}) => {
  const {
    state: { dataShipRefType }
  } = useStore();

  const handleSelectRef = (item: { id: number; name: string }) => {
    const updatedValues = { ...valueReference };
    updatedValues[keyRef] = { name: item.name, id: item.id as never };
    setValueReference(updatedValues);
  };

  return (
    <Dropdown
      classButton="border rounded-md border-[#19D1F0] justify-center h-[32px] px-2"
      className="dark:header_cus header_cus_light min-w-[179px] rounded-lg border bg-paperLight shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen"
      mainMenu={<IconArrowDown />}
    >
      <div className="w-full items-center">
        {dataShipRefType?.results?.map((item: { id: number; name: string }, index) => (
          <div
            className={clsx(
              'flex cursor-pointer items-center rounded-md p-2 text-lightPrimary hover:bg-neutralLight dark:text-santaGrey',
              {
                'bg-neutralLight': valueReference[keyRef].id === item?.id
              }
            )}
            key={index}
            onClick={() => handleSelectRef(item)}
          >
            <span className="text-xs">{item?.name}</span>
          </div>
        ))}
      </div>
    </Dropdown>
  );
};
