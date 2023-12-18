import { FC } from 'react';
import cx from 'clsx';

import type { GlyphIconType } from '../types';

const ShipmentConfirmation: FC<GlyphIconType> = ({ className }) => {
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
        d="M1.5 4.75C1.5 4.33579 1.83579 4 2.25 4H6.25C6.66421 4 7 4.33579 7 4.75V7.25C7 7.66421 6.66421 8 6.25 8H2.25C1.83579 8 1.5 7.66421 1.5 7.25V4.75Z"
        stroke="#667085"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.5 5.75C9.5 5.33579 9.83579 5 10.25 5H13.75C14.1642 5 14.5 5.33579 14.5 5.75V11.25C14.5 11.6642 14.1642 12 13.75 12H10.25C9.83579 12 9.5 11.6642 9.5 11.25V5.75Z"
        stroke="#667085"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.5 10.75C2.5 10.3358 2.83579 10 3.25 10H6.75C7.16421 10 7.5 10.3358 7.5 10.75V12.25C7.5 12.6642 7.16421 13 6.75 13H3.25C2.83579 13 2.5 12.6642 2.5 12.25V10.75Z"
        stroke="#667085"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ShipmentConfirmation;
