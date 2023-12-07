import type { GlyphsType } from './Glyphs';

export type IconsType = {
  className?: string;
  glyph?: GlyphsType['glyph'];
  onClick?: React.MouseEventHandler<SVGSVGElement>;
};

export type GlyphIconType = {
  className?: string;
  color?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
};
