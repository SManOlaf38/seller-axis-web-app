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
    bg: 'dark:bg-blueLight160 bg-blueDark160',
    textColor: 'dark:text-[#3BB2E4] text-[#2997C7]'
  },
  'bypassed acknowledge': {
    bg: 'dark:bg-blueLight160 bg-blueDark160',
    textColor: 'dark:text-[#3BB2E4] text-[#2997C7]'
  },
  shipped: {
    bg: 'dark:bg-secondaryDark bg-secondaryLight',
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
  },
  failed: {
    bg: 'bg-ErrorLight',
    textColor: 'text-reddishOrange'
  },
  completed: {
    bg: 'bg-primaryLight',
    textColor: 'text-tealishGreen'
  },
  opened: {
    bg: 'dark:bg-[#919EAB29] bg-[#66708529]',
    textColor: 'dark:text-grey200 text-greyLight500'
  },
  unverified: {
    bg: 'dark:bg-[#919EAB29] bg-[#66708529]',
    textColor: 'dark:text-grey200 text-greyLight500'
  },
  edited: {
    bg: 'dark:bg-blueLight160 bg-blueDark160',
    textColor: 'dark:text-[#3BB2E4] text-[#2997C7]'
  },
  verified: {
    bg: 'dark:bg-greenDark160 bg-greenLight160',
    textColor: 'dark:text-[#67BB9B] text-[#429777]'
  },
  'partly shipped': {
    bg: 'bg-pink160',
    textColor: 'text-pink100'
  },
  'partly shipped confirmed': {
    bg: 'bg-purple160',
    textColor: 'text-purple100'
  },
  backorder: {
    bg: 'bg-yellow160',
    textColor: 'text-yellow100'
  },
  created: {
    bg: 'bg-green160',
    textColor: 'text-greenDark'
  },
  submitted: {
    bg: 'bg-blue160',
    textColor: 'text-blueLight'
  },
  voided: {
    bg: 'bg-red160',
    textColor: 'text-redDark'
  },
  returned: {
    bg: 'bg-green160',
    textColor: 'text-greenDark'
  },
  'return opened': {
    bg: 'bg-orgLight',
    textColor: 'text-orgDark'
  },
  'return receive': {
    bg: 'bg-blue500',
    textColor: 'text-blueText500'
  },
  'dispute requested': {
    bg: 'bg-orgLight',
    textColor: 'text-orgDark'
  },
  'dispute denied': {
    bg: 'bg-bgred400',
    textColor: 'text-paleRed'
  },
  'dispute reimbursed': {
    bg: 'bg-blue500',
    textColor: 'text-blueText500'
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
