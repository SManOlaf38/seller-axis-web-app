'use client';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { schema } from '../schemas';
import InputFile from '@/components/common/InputFile';

export default function ProfileContainer() {
  const [fileImage, setFileImage] = useState<File>();
  const [errorImage, setErrorImage] = useState<string>();
  const [isHoverImage, setIsHoverImage] = useState<boolean>(false);

  const previewImage = useMemo(() => {
    return fileImage ? URL.createObjectURL(fileImage) : '';
  }, [fileImage]);

  const defaultValues = {
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  };

  const handleChangeFile = (fileImage?: File) => {
    setFileImage(fileImage);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async () => {};

  const onCancel = () => {
    reset();
    setErrorImage('');
  };

  const onDeleteImage = () => {
    setFileImage(undefined);
    setErrorImage('');
  };

  return (
    <div className="rounded-lg bg-darkGreen p-4">
      <div className="justify-start">
        <div className="mb-4 flex flex-col">
          <div
            onMouseEnter={() => setIsHoverImage(true)}
            onMouseLeave={() => setIsHoverImage(false)}
            className="relative"
          >
            <Image
              src={previewImage || '/userAccount.svg'}
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
          <div className="flex w-full flex-col gap-4">
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
                    isRequired
                    name="phone"
                    placeholder="Enter your phone"
                    error={errors.phone?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className=" mt-[16px] flex justify-end">
            <Button color="dark:bg-gunmetal bg-buttonLight" type="button" className="mr-[16px]" onClick={onCancel}>
              Cancel
            </Button>
            <Button color="bg-primary500" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
