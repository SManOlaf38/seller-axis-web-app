import CancelOrder from './CancelOrder';
import Cost from './Cost';
import Intersect from './Intersect';
import ManualShip from './ManualShip';
import Product from './Product';
import Recipient from './Recipient';
import Shipment from './Shipment';
import ShipmentConfirmation from './ShipmentConfirmation';

const glyphs = {
  'cancel-order': CancelOrder,
  'shipment-confirmation': ShipmentConfirmation,
  intersect: Intersect,
  cost: Cost,
  'manual-ship': ManualShip,
  recipient: Recipient,
  shipment: Shipment,
  product: Product
};

export type GlyphsType = {
  glyph: keyof typeof glyphs;
};

export { glyphs };
