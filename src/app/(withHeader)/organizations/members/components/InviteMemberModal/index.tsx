import { Controller, useForm } from 'react-hook-form';

import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { InviteMemberType, InviteType } from '../../../interfaces';

export const InviteMember = ({
  open,
  onModalMenuToggle,
  onSubmitData,
  isLoading
}: InviteMemberType) => {
  const defaultValues = {
    email: '',
    role: ''
  };

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

  const handleSubmitInvite = async (data: InviteType) => {
    onSubmitData({
      ...data,
      callback: resetValueForm
    });
  };

  const onCloseModal = () => {
    reset();
    onModalMenuToggle();
  };

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
                isRequired
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
                options={[
                  {
                    label: 'Admin',
                    value: '1',
                  },
                  {
                    label: 'User',
                    value: '2',
                  },
                ]}
                isRequired
                placeholder="Select role"
                multiple={false}
                label="Role"
                name="role"
                value={field.value}
                onChange={field.onChange}
                className="border-none px-3 py-2"
              />
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button color="bg-riverBed" onClick={onCloseModal} type="button">
            Cancel
          </Button>
          <Button isLoading={isLoading} disabled={isLoading} color="bg-dodgeBlue" type="submit">
            Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
};
