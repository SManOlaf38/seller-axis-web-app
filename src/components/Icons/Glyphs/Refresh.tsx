import { FC } from 'react';
import cx from 'clsx';

import type { GlyphIconType } from '../types';

const Refresh: FC<GlyphIconType> = ({ className }) => {
  return (
    <svg
      className={cx('object-contain duration-500', className)}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3518 7.7905H17.5123V7.78902M2.48633 16.3705V12.21M2.48633 12.21L6.64686 12.2099M2.48633 12.21L5.13707 14.8624C5.96251 15.6894 7.01006 16.3168 8.21985 16.641C11.8874 17.6237 15.6572 15.4472 16.64 11.7796M3.35849 8.22086C4.34122 4.55328 8.11103 2.37678 11.7786 3.3595C12.9884 3.68367 14.036 4.3111 14.8614 5.13808L17.5123 7.78902M17.5123 3.63V7.78902"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Refresh;
