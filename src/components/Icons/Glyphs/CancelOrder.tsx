import { FC } from 'react';
import cx from 'clsx';

import type { GlyphIconType } from '../types';

const CancelOrder: FC<GlyphIconType> = ({ className }) => {
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
        d="M13.5 5L13.0831 12.0881C13.0364 12.8809 12.3799 13.5 11.5856 13.5H4.41436C3.62014 13.5 2.96358 12.8809 2.91695 12.0881L2.5 5M6.5 7.75L8 9.25M8 9.25L9.5 10.75M8 9.25L9.5 7.75M8 9.25L6.5 10.75M2.25 5H13.75C14.1642 5 14.5 4.66421 14.5 4.25V3.25C14.5 2.83579 14.1642 2.5 13.75 2.5H2.25C1.83579 2.5 1.5 2.83579 1.5 3.25V4.25C1.5 4.66421 1.83579 5 2.25 5Z"
        stroke="#667085"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default CancelOrder;
