import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaInviteMember } from '../../../../constants';
import type { InviteMemberType, InviteType } from '../../../../interfaces';

export const InviteMember = ({
  open,
  onModalMenuToggle,
  onSubmitData,
  isLoading,
  roles,
  errorMessage,
  detailMember
}: InviteMemberType) => {
  const defaultValues = useMemo(() => {
    return {
      email: detailMember?.email || '',
      role: {
        label: detailMember?.role?.name,
        value: detailMember?.role?.id
      } || {
        label: undefined,
        value: undefined
      }
    };
  }, [detailMember]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaInviteMember)
  });

  const resetValueForm = () => {
    reset();
  };

  const handleSubmitInvite = async (data: InviteType) => {
    onSubmitData({
      ...data,
      callback: () => {
        resetValueForm();
        onCloseModal();
      }
    });
  };

  const onCloseModal = () => {
    reset();
    onModalMenuToggle();
  };

  useEffect(() => {
    reset({
      email: detailMember?.email,
      role: {
        label: detailMember?.role?.name,
        value: detailMember?.role?.id
      }
    });
  }, [detailMember, reset]);

  return (
    <Modal open={open} title={'Invite member'} onClose={onCloseModal}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSubmitInvite)}>
        <div>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                label="Email"
                required
                name="email"
                placeholder="Enter email"
                error={errors.email?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Autocomplete
                options={roles?.map((item: any) => ({
                  label: item.name,
                  value: item.id
                }))}
                required
                placeholder="Select role"
                label="Role"
                name="role"
                value={field.value}
                onChange={field.onChange}
                className="border-none px-3 py-2"
                error={errors.role?.message}
              />
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button color="dark:bg-gunmetal bg-buttonLight" onClick={onCloseModal} type="button">
            Cancel
          </Button>
          <Button isLoading={isLoading} disabled={isLoading} color="bg-primary500" type="submit">
            {detailMember?.id ? 'Update' : 'Invite'}
          </Button>
        </div>
        {errorMessage && <span className="text-end text-red-800">{errorMessage}</span>}
      </form>
    </Modal>
  );
};
