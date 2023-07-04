import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { UploadImageCom } from '@/components/common/UploadImage';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import useHandleImage from '@/hooks/useHandleImage';
import { TimeZone } from '@/utils/timezones';
import { schemaOrganization } from '../../../constants';
import { useStore } from '../../../context';
import * as action from '../../../context/action';
import { getOrganizationDetailService, updateOrganizationsService } from '../../../fetch';
import type { OrganizationDetailType } from '../../../interfaces';

const MainOrganization = () => {
  const {
    state: { isLoading, dataOrganization },
    dispatch
  } = useStore();

  const defaultValues: OrganizationDetailType = useMemo(() => {
    return {
      name: dataOrganization?.name || '',
      avatar: dataOrganization?.avatar || '',
      description: dataOrganization?.description || '',
      address: dataOrganization?.address || '',
      email: dataOrganization?.email || '',
      phone: dataOrganization?.phone || '',
      status: dataOrganization?.status || '',
      timezone: dataOrganization?.timezone || ''
    };
  }, [dataOrganization]);

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

  const { file, image, onDeleteImage, handleImage } = useHandleImage();

  const handleUpdateOrganization = async (data: OrganizationDetailType) => {
    try {
      dispatch(action.updateOrganizationRequest());
      await updateOrganizationsService({
        ...data,
        id: dataOrganization?.id
      });
      getOrganizationDetail();
      dispatch(action.updateOrganizationSuccess());
    } catch (error: any) {
      reset(dataOrganization);
      dispatch(action.updateOrganizationFail(error));
    }
  };

  const onSubmitClassification = async (data: OrganizationDetailType) => {
    handleUpdateOrganization({
      ...data,
      avatar: file
    });
  };

  const getOrganizationDetail = useCallback(async () => {
    try {
      dispatch(action.getOrganizationDetailRequest());
      const data = await getOrganizationDetailService();
      dispatch(action.getOrganizationDetailSuccess(data));
    } catch (error: any) {
      dispatch(action.getOrganizationDetailFail(error));
    }
  }, [dispatch]);

  useEffect(() => {
    getOrganizationDetail();
  }, [getOrganizationDetail]);

  useEffect(() => {
    reset(dataOrganization);
  }, [dataOrganization, reset]);

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
                isRequired
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
            isLoading={isLoading}
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MainOrganization;
