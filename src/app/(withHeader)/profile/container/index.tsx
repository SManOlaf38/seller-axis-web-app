'use client';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import omit from 'lodash/omit';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { schema } from '../schemas';
import InputFile from '@/components/common/InputFile';
import { Card } from '@/components/ui/Card';
import { useStoreProfile } from '../context';
import { ContextProfileType } from '../context/type';
import {
  getProfileRequest,
  getProfileSuccess,
  updateProfileFail,
  updateProfileRequest,
  updateProfileSuccess
} from '../context/action';
import { getProfileService, updateProfileService } from '../fetch';
import { getAvatarUrl } from '@/utils/utils';

export default function ProfileContainer() {
  const { state, dispatch: profileDispatch }: ContextProfileType = useStoreProfile();
  const [fileImage, setFileImage] = useState<File | null>();
  const [errorImage, setErrorImage] = useState<string>();
  const [isHoverImage, setIsHoverImage] = useState<boolean>(false);

  const previewImage = useMemo(() => {
    return fileImage ? URL.createObjectURL(fileImage) : '';
  }, [fileImage]);

  const defaultValues = {
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    avatar: ''
  };

  const handleChangeFile = (fileImage?: File) => {
    setFileImage(fileImage);
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isDirty },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const avatar = watch('avatar');

  const onSubmit = handleSubmit(async (data) => {
    const body = omit(data, ['id']);
    try {
      profileDispatch(updateProfileRequest());
      const dataRequest = await updateProfileService({
        ...body,
        avatar: fileImage ? fileImage : data.avatar
      });
      profileDispatch(updateProfileSuccess(dataRequest));
    } catch (error: any) {
      profileDispatch(updateProfileFail(error?.detail));
    }
  });

  const onCancel = async () => {
    getProfile();
    setErrorImage('');
  };

  const getProfile = async () => {
    profileDispatch(getProfileRequest());
    const dataProfile = await getProfileService();
    profileDispatch(getProfileSuccess(dataProfile));
  };

  const onDeleteImage = () => {
    setFileImage(undefined);
    setErrorImage('');
    setValue('avatar', '');
  };

  useEffect(() => {
    if (state?.dataProfile) {
      Object.keys(state?.dataProfile).forEach((key: any) => {
        setValue(key, state?.dataProfile[key]);
      });
      setValue('avatar', state?.dataProfile?.avatar);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.dataProfile, setValue, reset]);

  return (
    <Card className="p-[16px]">
      <div className="justify-start">
        <div className="mb-4 flex flex-col">
          <div
            onMouseEnter={() => setIsHoverImage(true)}
            onMouseLeave={() => setIsHoverImage(false)}
            className="relative"
          >
            <Image
              src={previewImage || getAvatarUrl(avatar)}
              width={72}
              height={72}
              alt="image_profile"
              className="mb-[8px] rounded-full "
            />
            {isHoverImage && previewImage && (
              <div className="opacity-1 absolute left-[30px] top-0">
                <div className="flex items-end justify-end">
                  <Button onClick={onDeleteImage}>
                    <Image
                      src="/pencil.svg"
                      width={15}
                      height={15}
                      alt="Picture of the author"
                      className="fill-darkGreen"
                    />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <InputFile
            onChange={handleChangeFile}
            errorImage={errorImage}
            setErrorImage={setErrorImage}
          />
        </div>
        <form onSubmit={onSubmit} noValidate className="w-full">
          <div className="flex w-full flex-col gap-4">
            <div>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled
                    label="Email"
                    required
                    name="email"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="first_name"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="First name"
                    name="first_name"
                    placeholder="Enter your first name"
                    error={errors.first_name?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Last name"
                    name="last_name"
                    placeholder="Enter your last name"
                    error={errors.last_name?.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Phone"
                    required
                    name="phone"
                    placeholder="Enter your phone"
                    error={errors.phone?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className=" mt-[16px] flex justify-end">
            <Button
              disabled={state?.isLoading}
              color="dark:bg-gunmetal bg-buttonLight"
              type="button"
              className="mr-[16px] min-w-[100px] items-center justify-center"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="min-w-[100px] items-center justify-center"
              disabled={state?.isLoading || (Boolean(!previewImage) && !isDirty)}
              isLoading={state?.isLoadingCreate}
              color="bg-primary500"
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
