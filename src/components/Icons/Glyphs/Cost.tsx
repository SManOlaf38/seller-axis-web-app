import { FC } from 'react';
import cx from 'clsx';

import type { GlyphIconType } from '../types';

const Cost: FC<GlyphIconType> = ({ className }) => {
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
        d="M8 4V12M6 10.1212L6.58592 10.5607C7.36693 11.1464 8.63322 11.1464 9.41424 10.5607C10.1953 9.97487 10.1953 9.02513 9.41424 8.43934C9.02369 8.14642 8.5118 7.99997 7.99992 8C7.51664 8.00003 7.03347 7.8536 6.66473 7.56068C5.92733 6.97489 5.92733 6.02514 6.66473 5.43936C7.40213 4.85357 8.59769 4.85357 9.33509 5.43936L9.61168 5.65908M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
        stroke="#667085"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Cost;
