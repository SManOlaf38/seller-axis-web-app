import clsx from 'clsx';

type IKey = {
  [key: string]: { bg: string; textColor: string };
};

const dataStatus: IKey = {
  open: {
    bg: 'dark:bg-grey bg-grey160',
    textColor: 'dark:text-[#EAECF0] text-[#2997C7]'
  },
  acknowledged: {
    bg: 'dark:bg-blueLight160 bg-blueDark',
    textColor: 'dark:text-[#3BB2E4] text-[#2997C7]'
  },
  shipped: {
    bg: 'dark:bg-secondaryDark160 bg-secondaryLight160',
    textColor: 'dark:text-[#36F] text-[#2952CC]'
  },
  'shipment confirmed': {
    bg: 'dark:bg-purpleDark160 bg-purpleLight160',
    textColor: 'dark:text-[#B982FF] text-[#925FD3]'
  },
  invoiced: {
    bg: 'dark:bg-orangeDark160 bg-orangeLight160',
    textColor: 'dark:text-[#FA9550] text-[#E37318]'
  },
  'invoice confirmed': {
    bg: 'dark:bg-greenDark160 bg-greenLight160',
    textColor: 'dark:text-[#67BB9B] text-[#429777]'
  },
  cancelled: {
    bg: 'dark:bg-redDark160 bg-redLight160',
    textColor: 'dark:text-[#DF4F45] text-[#CE170A]'
  }
};

type IStatus = {
  className?: string;
  name: string;
};

export default function Status({ className, name }: IStatus) {
  return (
    <div
      className={clsx(
        'inline rounded-full px-2 py-1 text-xs capitalize',
        className,
        `${dataStatus[name.toLowerCase()]?.bg} ${dataStatus[name.toLowerCase()]?.textColor}`
      )}
    >
      {name || ''}
    </div>
  );
}
