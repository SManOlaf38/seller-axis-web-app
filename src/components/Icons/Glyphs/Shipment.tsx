import { FC } from 'react';
import cx from 'clsx';

import type { GlyphIconType } from '../types';

const Shipment: FC<GlyphIconType> = ({ className }) => {
  return (
    <svg
      className={cx('object-contain duration-500', className)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 8H13.5M2.5 10.5H13.5M2.5 13H13.5M3.75 3H12.25C12.9404 3 13.5 3.55964 13.5 4.25C13.5 4.94036 12.9404 5.5 12.25 5.5H3.75C3.05964 5.5 2.5 4.94036 2.5 4.25C2.5 3.55964 3.05964 3 3.75 3Z"
        stroke="#667085"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Shipment;
