'use client';

import Autocomplete from '@/components/ui/Autocomplete';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';

export const filterStatus = [
  {
    label: 'Shipping',
    value: 'shipping'
  },
  {
    label: 'Shipped',
    value: 'shipped'
  },
  {
    label: 'Confirmed',
    value: 'confirmed'
  },
  {
    label: 'Received',
    value: 'received'
  }
];

const ConfigureShipment = () => {
  return (
    <CardToggle title="Configure Shipment" className="grid w-full grid-cols-1 gap-2">
      <div className="grid w-full grid-cols-1 gap-2">
        <Autocomplete
          options={filterStatus}
          addNew={false}
          label="Shipper"
          name="status"
          placeholder="Select Shipper"
          value={filterStatus[0]}
          onChange={() => {}}
        />

        <Autocomplete
          options={filterStatus}
          addNew={false}
          label="Carrier"
          name="status"
          placeholder="Select Carrier"
          value={filterStatus[0]}
          onChange={() => {}}
        />
        <Autocomplete
          options={filterStatus}
          addNew={false}
          label="Service"
          name="status"
          placeholder="Select Service"
          value={filterStatus[0]}
          onChange={() => {}}
        />

        <Autocomplete
          options={filterStatus}
          addNew={false}
          label="Package Rule"
          name="status"
          placeholder="Select Package Rule"
          value={filterStatus[0]}
          onChange={() => {}}
        />

        <Input label="Reference Number #1" />
        <Input label="Reference Number #2" />
        <Input label="Reference Number #3" />
        <Input label="Reference Number #4" />
        <Input label="Reference Number #5" />
      </div>
    </CardToggle>
  );
};

export default ConfigureShipment;
