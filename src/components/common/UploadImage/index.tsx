import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';

interface UploadImageComProp {
  label: string;
  name: string;
  image: string;
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
  error?: string;
}
export const UploadImageCom = ({
  label,
  name,
  image,
  onChangeImage,
  onDeleteImage,
  error
}: UploadImageComProp) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="flex w-full items-center justify-center ">
        <label
          className={clsx(
            'flex w-full cursor-pointer flex-col items-center justify-center rounded-lg',
            { 'border border-dashed border-iridium': !image }
          )}
        >
          <div className={clsx({ hidden: !!image })}>
            <div className="flex flex-col items-center justify-center py-4 text-sm">
              <Image src="/upload.svg" width={20} height={20} alt="Picture of the author" />
              <p>
                Drop the file here or
                <span className="ml-1 text-dodgerBlue">click</span> to upload
              </p>
              <p className="text-[#8A8C8E]">Only JPG and PNG files (3MB) are accepted.</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png"
              name={name}
              onChange={onChangeImage}
            />
          </div>
          <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={`${!!image ? 'relative' : 'hidden'} `}
          >
            <Image
              placeholder="blur"
              blurDataURL="/loading.png"
              src={image}
              width={72}
              height={72}
              alt="Picture of the author"
              className="h-20 w-20 rounded-[50%]"
            />
            {isHover && (
              <div className="opacity-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full">
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
          {image && <span className="my-1 text-primary400">Edit</span>}
        </label>
      </div>
      {error && <p className="mb-2 mt-1 block text-sm font-medium text-red">{error as string}</p>}{' '}
    </div>
  );
};
