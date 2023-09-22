import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';

import { useStore } from '@/app/(withHeader)/retailers/context';
import IconArrowDown from 'public/dropdown-icon.svg';
import { Dropdown } from '@/components/ui/Dropdown';
import { ReferenceKey } from '../../constants';
import { ShipRefType, ShipRefTypeResult } from '../../interface';
import { UseFormSetValue } from 'react-hook-form';

export const SelectReference = ({
  keyRef,
  valueReference,
  setValueReference,
  setValue
}: {
  keyRef: ReferenceKey;
  valueReference: ShipRefType;
  setValueReference: Dispatch<SetStateAction<ShipRefType>>;
  setValue: UseFormSetValue<any>;
}) => {
  const {
    state: { dataShipRefType }
  } = useStore();

  const handleSelectRef = (item: ShipRefTypeResult) => {
    const updatedValues = { ...valueReference };
    setValue(`${keyRef}_value`, item?.data_field || '');
    updatedValues[keyRef] = { name: item.name, id: item.id as never, data_field: item?.data_field };
    setValueReference(updatedValues);
  };

  return (
    <Dropdown
      classButton="border rounded-md border-[#19D1F0] justify-center h-[32px] px-2"
      className="dark:header_cus header_cus_light min-w-[179px] rounded-lg border bg-paperLight shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen"
      mainMenu={<IconArrowDown />}
    >
      <div className="w-full items-center">
        {dataShipRefType?.results?.map((item: ShipRefTypeResult, index) => (
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
