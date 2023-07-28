import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DATA_Dimension_Unit } from '@/app/(withHeader)/package-rules/constants';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';

type InviteMember = {
  open: boolean;
  onModalMenuToggle: () => void;
  isLoading?: boolean;
  errorMessage?: string;
  detailMember?: any;
};

export const InviteMember = ({
  open,
  onModalMenuToggle,
  isLoading,
  errorMessage,
  detailMember,
}: InviteMember) => {
  const defaultValues = useMemo(() => {
    return {
      sku: null,
      quantity: 0,
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
      dimension_unit: ''
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

  const resetValueForm = () => {
    reset();
  };

  const handleSubmitInvite = async () => {};

  const onCloseModal = () => {
    reset();
    onModalMenuToggle();
  };

  useEffect(() => {
    reset(detailMember);
  }, [detailMember, reset]);

  return (
    <Modal open={open} title={'Add Package'} onClose={onCloseModal}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSubmitInvite)}>
        <div>
          <Controller
            control={control}
            name="sku"
            render={({ field }) => (
              <Autocomplete
                options={[
                  {
                    value: 1,
                    label: 'Test'
                  }
                ]}
                required
                placeholder="Select SKU"
                label="SKU"
                name="sku"
                value={field.value}
                onChange={field.onChange}
                className="border-none px-3 py-2"
                error={errors.sku?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="quantity"
            render={({ field }) => (
              <Input
                {...field}
                label="QTY"
                required
                name="quantity"
                placeholder="0"
                error={errors.quantity?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="width"
            render={({ field }) => (
              <Input
                {...field}
                label="width"
                required
                name="width"
                placeholder="0"
                error={errors.width?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="weight"
            render={({ field }) => (
              <Input
                {...field}
                label="weight"
                required
                name="weight"
                placeholder="0"
                error={errors.weight?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="height"
            render={({ field }) => (
              <Input
                {...field}
                label="Height"
                required
                type="number"
                name="height"
                placeholder="0"
                error={errors.height?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="length"
            render={({ field }) => (
              <Input
                {...field}
                label="Length"
                required
                type="number"
                name="length"
                placeholder="0"
                error={errors.length?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="dimension_unit"
            render={({ field }) => (
              <Select
                {...field}
                required
                label="Dimension unit"
                options={DATA_Dimension_Unit}
                name="dimension_unit"
                error={errors.dimension_unit?.message?.toString()}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button color="dark:bg-gunmetal bg-buttonLight" onClick={onCloseModal} type="button">
            Cancel
          </Button>
          <Button isLoading={isLoading} disabled={isLoading} color="bg-primary500" type="submit">
            {detailMember?.id ? 'Update' : 'Add'}
          </Button>
        </div>
        {errorMessage && <span className="text-red-800 text-end">{errorMessage}</span>}
      </form>
    </Modal>
  );
};
