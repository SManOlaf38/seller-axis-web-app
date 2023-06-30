import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { UploadImageCom } from '@/components/common/UploadImage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import Autocomplete from '@/components/ui/Autocomplete';
import { Card } from '@/components/ui/Card';
import useHandleImage from '@/hooks/useHandleImage';
import { TimeZone } from '@/utils/timezones';
import { useStore } from '../../../context';
import * as action from '../../../context/action';
import { OrganizationDetailType } from '../../../interfaces';

const MainOrganization = ({ detail }: { detail: OrganizationDetailType | undefined }) => {
  const { dispatch } = useStore();

  const defaultValues = useMemo(() => {
    return {
      name: detail?.name || '',
      avatar: detail?.avatar || '',
      description: detail?.description || '',
      address: detail?.address || '',
      email: detail?.email || '',
      phone: detail?.phone || '',
      status: detail?.status || '',
      timezone: detail?.timezone || ''
    };
  }, [detail]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
  });

  const { file, image, onDeleteImage, handleImage } = useHandleImage();

  const handleUpdateOrganization = async (data: OrganizationDetailType) => {
    try {
      dispatch(action.updateOrganizationRequest());
      // updateOrganizationService(data)
      dispatch(action.updateOrganizationSuccess());
    } catch (error: any) {
      dispatch(action.updateOrganizationFail(error));
    }
  };

  const onSubmitClassification = async (data: OrganizationDetailType) => {
    handleUpdateOrganization({
      ...data,
      avatar: file
    });
  };

  return (
    <Card>
      <div className="flex w-full justify-center">
        <UploadImageCom
          label="Logo"
          image={image}
          onChangeImage={handleImage}
          onDeleteImage={onDeleteImage}
          name="logo"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmitClassification)}>
        <div className="my-4">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                label="Name"
                isRequired
                name="name"
                placeholder="Enter Name"
                error={errors.name?.message}
              />
            )}
          />
        </div>
        <div className="my-4">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                disabled
                label="Email"
                isRequired
                name="email"
                placeholder="Enter Email"
                error={errors.email?.message}
              />
            )}
          />
        </div>
        <div className="my-4">
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                {...field}
                label="Address"
                isRequired
                name="address"
                placeholder="Enter Address"
                error={errors.address?.message}
              />
            )}
          />
        </div>
        <div className="my-4">
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                {...field}
                label="Phone"
                isRequired
                name="phone"
                placeholder="Enter phone"
                error={errors.phone?.message}
              />
            )}
          />
        </div>

        <div className="my-4">
          <Controller
            control={control}
            name="timezone"
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={TimeZone.map((item) => ({
                  label: item.text,
                  value: item.value
                }))}
                isRequired
                label="Timezone"
                name="timezone"
                placeholder='Select timezone'
                className="border-none px-3 py-2"
              />
            )}
          />
        </div>
        <div className="my-4">
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextArea
                {...field}
                rows={4}
                label="Description"
                isRequired
                name="description"
                placeholder="Enter description"
                error={errors.description?.message}
              />
            )}
          />
        </div>

        <div className="flex w-full justify-end">
          <Button className="bg-dodgerBlue">Save</Button>
        </div>
      </form>
    </Card>
  );
};

export default MainOrganization;
