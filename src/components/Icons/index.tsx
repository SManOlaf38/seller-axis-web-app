import { FC } from 'react';

import { glyphs } from './Glyphs';
import type { IconsType } from './types';

const Icons: FC<IconsType> = ({ className = '', glyph, onClick }) => {
  const Glyph = glyph && glyphs[glyph];

  if (Glyph) {
    return <Glyph className={className} onClick={onClick} />;
  }
  return null;
};

export default Icons;
