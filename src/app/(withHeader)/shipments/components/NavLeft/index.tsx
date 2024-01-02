'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { listMenuNavLef } from '../../constants';

const NavLeft = () => {
  const pathname = usePathname();

  return (
    <Card>
      {listMenuNavLef.map(({ name, url, disabled }) => (
        <div key={name}>
          {disabled ? (
            <div className="mb-1 flex h-[40px] cursor-not-allowed items-center px-2 text-sm font-semibold text-gray-400">
              {name}
            </div>
          ) : (
            <Link
              className={clsx('mb-1 flex h-[40px] items-center px-2 text-sm font-semibold', {
                'rounded-md bg-neutralLight text-dodgeBlue200 dark:bg-gunmetal': pathname === url,
                'text-santaGrey': pathname !== url
              })}
              href={url}
              key={name}
            >
              {name}
            </Link>
          )}
        </div>
      ))}
    </Card>
  );
};

export default NavLeft;
