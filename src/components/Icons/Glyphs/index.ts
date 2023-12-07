import CancelOrder from './CancelOrder';
import Intersect from './Intersect';
import ShipmentConfirmation from './ShipmentConfirmation';

const glyphs = {
  'cancel-order': CancelOrder,
  'shipment-confirmation': ShipmentConfirmation,
  intersect: Intersect
};

export type GlyphsType = {
  glyph: keyof typeof glyphs;
};

export { glyphs };
