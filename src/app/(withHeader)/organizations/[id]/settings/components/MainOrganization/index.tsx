import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { schemaOrganization } from '@/app/(withHeader)/organizations/constants';
import { useStore } from '@/app/(withHeader)/organizations/context';
import * as action from '@/app/(withHeader)/organizations/context/action';
import * as service from '@/app/(withHeader)/organizations/fetch';
import { OrganizationDetailType } from '@/app/(withHeader)/organizations/interfaces';
import { UploadImageCom } from '@/components/common/UploadImage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import useHandleImage from '@/hooks/useHandleImage';
import { TimeZone } from '@/utils/timezones';

const MainOrganization = ({ id }: { id: string }) => {
  const {
    state: { organizations, isLoadingUpdate },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const defaultValues: OrganizationDetailType = useMemo(() => {
    return {
      name: organizations[id]?.name || '',
      avatar: organizations[id]?.avatar || '',
      description: organizations[id]?.description || '',
      address: organizations[id]?.address || '',
      email: organizations[id]?.email || '',
      phone: organizations[id]?.phone || '',
      timezone: organizations[id]?.timezone || ''
    };
  }, [id, organizations]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<OrganizationDetailType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaOrganization)
  });

  const { file, image, onDeleteImage, handleImage, handleUploadImages, onChangeImage } =
    useHandleImage();

  const handleUpdateOrganization = async (data: OrganizationDetailType) => {
    try {
      const body = {
        id: data?.id,
        name: data?.name,
        avatar: data?.avatar,
        description: data?.description,
        address: data?.address,
        email: data?.email,
        phone: data?.phone,
        timezone: data?.timezone
      };
      dispatch(action.updateOrganizationRequest());
      const dataOrg = await service.updateOrganizationsService(body);
      dispatch(action.updateOrganizationSuccess(dataOrg));
      dispatchAlert(
        openAlertMessage({
          message: 'Organization updated successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      reset(organizations[id]);
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
      dispatch(action.updateOrganizationFail(error));
    }
  };

  const onSubmitClassification = async (data: OrganizationDetailType) => {
    const dataImg = (await handleUploadImages(file)) as string;

    handleUpdateOrganization({
      ...data,
      avatar: dataImg
    });
  };

  useEffect(() => {
    if (id && organizations[id]) {
      reset(organizations[id]);
    }
  }, [id, organizations, reset]);

  return (
    <Card>
      <div className="flex w-full justify-center">
        <UploadImageCom
          label="Logo"
          image={image || organizations[id]?.avatar}
          onChangeImage={handleImage}
          onDeleteImage={onDeleteImage}
          name="logo"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmitClassification)} noValidate>
        <div className="my-4">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                label="Name"
                required
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
                label="Email"
                required
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
                required
                type="number"
                label="Phone"
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
              <Select
                {...field}
                options={TimeZone.map((item) => ({
                  label: item.text,
                  value: item.value
                }))}
                label="Timezone"
                name="timezone"
                placeholder="Select timezone"
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
                name="description"
                placeholder="Enter description"
                error={errors.description?.message}
              />
            )}
          />
        </div>

        <div className="flex w-full justify-end">
          <Button
            className="w-[100px] items-center justify-center text-center"
            type="submit"
            color="bg-primary500"
            isLoading={isLoadingUpdate}
            disabled={isLoadingUpdate}
          >
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MainOrganization;
