import clsx from 'clsx';

import { useStore } from '@/app/(withHeader)/retailers/context';
import IconArrowDown from 'public/dropdown-icon.svg';
import { Dropdown } from '@/components/ui/Dropdown';
import { ReferenceKey } from '../../constants';
import { ShipRefType, ShipRefTypeResult } from '../../interface';

export const SelectReference = ({
  keyRef,
  valueReference,
  handleSelectRef
}: {
  keyRef: ReferenceKey;
  valueReference: ShipRefType;
  handleSelectRef: (item: ShipRefTypeResult, keyRef: ReferenceKey) => void;
}) => {
  const {
    state: { dataShipRefType }
  } = useStore();

  const handleSelectRefNumber = (item: ShipRefTypeResult, keyRef: ReferenceKey) => {
    handleSelectRef && handleSelectRef(item, keyRef);
  };

  return (
    <Dropdown
      classButton="border rounded-md border-[#19D1F0] justify-center h-[32px] px-2"
      className="dark:header_cus header_cus_light min-w-[179px] rounded-lg border bg-paperLight shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen"
      mainMenu={<IconArrowDown />}
    >
      <div className="w-full items-center">
        {dataShipRefType?.results?.length > 0 ? (
          dataShipRefType?.results?.map((item: ShipRefTypeResult, index) => (
            <div
              className={clsx(
                'flex cursor-pointer items-center rounded-md p-2 text-lightPrimary hover:bg-neutralLight dark:text-santaGrey',
                {
                  'bg-neutralLight': valueReference[keyRef].id === item?.id
                }
              )}
              key={index}
              onClick={() => handleSelectRefNumber(item, keyRef)}
            >
              <span className="text-xs">{item?.name}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No results</p>
        )}
      </div>
    </Dropdown>
  );
};
