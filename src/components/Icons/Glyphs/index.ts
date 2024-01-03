import CancelOrder from './CancelOrder';
import Cost from './Cost';
import Delete from './Delete';
import Intersect from './Intersect';
import ManualShip from './ManualShip';
import Product from './Product';
import Recipient from './Recipient';
import Refresh from './Refresh';
import Search from './Search';
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
  product: Product,
  refresh: Refresh,
  delete: Delete,
  search: Search
};

export type GlyphsType = {
  glyph: keyof typeof glyphs;
};

export { glyphs };
