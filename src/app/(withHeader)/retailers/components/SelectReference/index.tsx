import { useState } from 'react';
import clsx from 'clsx';
import { UseFormSetValue } from 'react-hook-form';

import IconArrowDown from 'public/dropdown-icon.svg';
import { DATA_REFERENCE } from '@/constants';
import { Dropdown } from '@/components/ui/Dropdown';
import { ReferenceKey } from '../../constants';

export const SelectReference = ({
  keyRef,
  setValue
}: {
  keyRef: ReferenceKey;
  setValue: UseFormSetValue<any>;
}) => {
  const [valueReference, setValueReference] = useState({
    shipping_ref_1: '',
    shipping_ref_2: '',
    shipping_ref_3: '',
    shipping_ref_4: '',
    shipping_ref_5: ''
  });

  const handleSelectRef = (item: { value: string; label: string }) => {
    const updatedValues = { ...valueReference };
    updatedValues[keyRef] = item.label;
    setValue(keyRef, `${updatedValues[keyRef as ReferenceKey]} - `);
    setValueReference(updatedValues);
  };

  return (
    <Dropdown
      classButton="border rounded-md border-[#19D1F0] justify-center h-[32px] px-2"
      className="dark:header_cus header_cus_light min-w-[179px] rounded-lg border bg-paperLight shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen"
      mainMenu={<IconArrowDown />}
    >
      <div className="w-full items-center">
        {DATA_REFERENCE.map((item, index) => (
          <div
            className={clsx(
              'flex cursor-pointer items-center rounded-md p-2 text-lightPrimary hover:bg-neutralLight dark:text-santaGrey',
              {
                'bg-neutralLight': valueReference[keyRef] === item.label
              }
            )}
            key={index}
            onClick={() => handleSelectRef(item)}
          >
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </Dropdown>
  );
};
