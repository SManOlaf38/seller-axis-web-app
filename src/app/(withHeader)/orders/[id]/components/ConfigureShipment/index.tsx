'use client';

import Autocomplete from '@/components/ui/Autocomplete';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

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

const ConfigureShipment = ({ onShipment }: { onShipment: (data: any) => void }) => {
  const defaultValues = {
    carrier_id: null,
    retailer_person_place_id: '',
    services: null,
    shipping_ref_1: '',
    shipping_ref_2: '',
    
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
    getValues
  } = useForm({
    defaultValues,
    mode: 'onChange',
    // resolver: yupResolver<any>(schemaProduct)
  });

  return (
    <CardToggle title="Configure Shipment" className="grid w-full grid-cols-1 gap-2">
      <div className="grid w-full grid-cols-1 gap-2">
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
