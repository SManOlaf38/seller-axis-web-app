import { FC } from 'react';
import cx from 'clsx';

import type { GlyphIconType } from '../types';

const Intersect: FC<GlyphIconType> = ({ className }) => {
  return (
    <svg
      className={cx('object-contain duration-500', className)}
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.72888 1.21494C10.4626 1.30009 11 1.93267 11 2.67132V13L6 10.5L1 13V2.67132C1 1.93267 1.53739 1.30009 2.27112 1.21494C3.49437 1.07298 4.73866 1 6 1C7.26134 1 8.50563 1.07298 9.72888 1.21494Z"
        stroke="#667085"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Intersect;
