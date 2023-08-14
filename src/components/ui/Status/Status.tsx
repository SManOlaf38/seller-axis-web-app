import clsx from 'clsx';

type IKey = {
  [key: string]: { bg: string; textColor: string };
};

const dataStatus: IKey = {
  shipping: {
    bg: 'bg-warningLight',
    textColor: 'text-warning'
  },
  acknowledged: {
    bg: 'bg-grey',
    textColor: 'text-white dark:text-dark'
  },
  received: {
    bg: 'bg-primaryLight',
    textColor: 'text-tealishGreen'
  },
  cancelled: {
    bg: 'bg-ErrorLight',
    textColor: 'text-reddishOrange'
  },

  opened: {
    bg: 'bg-secondaryLight',
    textColor: 'text-secondary'
  },
  delivered: {
    bg: 'bg-info',
    textColor: 'text-infoLight'
  },

  confirmed: {
    bg: 'bg-ErrorLight',
    textColor: 'text-reddishOrange'
  },
  shipped: {
    bg: 'bg-ErrorLight',
    textColor: 'text-reddishOrange'
  },

  cancelling: {
    bg: 'bg-ErrorLight',
    textColor: 'text-reddishOrange'
  },
  invoiced: {
    bg: 'bg-ErrorLight',
    textColor: 'text-reddishOrange'
  },
  closed: {
    bg: 'bg-ErrorLight',
    textColor: 'text-reddishOrange'
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
