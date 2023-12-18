import { FC } from 'react';
import cx from 'clsx';

import type { GlyphIconType } from '../types';

const Product: FC<GlyphIconType> = ({ className }) => {
  return (
    <svg
      className={cx('object-contain duration-500', className)}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.2861 4L7.28613 0.5L1.28613 4M13.2861 4L7.28613 7.5M13.2861 4V10L7.28613 13.5M1.28613 4L7.28613 7.5M1.28613 4V10L7.28613 13.5M7.28613 7.5V13.5" />
    </svg>
  );
};

export default Product;
