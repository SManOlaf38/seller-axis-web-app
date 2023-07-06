'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import FormProduct from '../components/FormProduct';

const NewProductContainer = () => {
  const defaultValues = useMemo(() => {
    return {
      sku: '',
      unit_of_measure: '',
      available: '',
      upc: '',
      description: '',
      unit_cost: 0,
      qty_on_hand: 0,
      qty_reserve: 0,
      image: '',
      package_rule: 0,
      cost: '',
      warehouse: ''
    };
  }, []);

  const {
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Create Product</h2>
      <FormProduct control={control} errors={errors} />
    </main>
  );
};

export default NewProductContainer;
