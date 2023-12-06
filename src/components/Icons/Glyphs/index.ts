import CancelOrder from './CancelOrder';

const glyphs = {
  'cancel-order': CancelOrder
};

export type GlyphsType = {
  glyph: keyof typeof glyphs;
};

export { glyphs };
